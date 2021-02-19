---
title: 3 approaches to consider when rendering conditional content in React
date: "2021-02-19T07:54:24.368Z"
description: "
In this post, I'd like to share alternative approaches for dealing with
conditional rendering in React. I will try to list out the pros and cons about 3
different approaches (doesn't mean couldn't be more!) and hopefully this can be
useful for you someday.
"
---

In this post, I'd like to share alternative approaches for dealing with
[conditional rendering](https://reactjs.org/docs/conditional-rendering.html) in
[React](https://reactjs.org/). I will try to list out the pros and cons about 3
different approaches (doesn't mean couldn't be more!) and hopefully this can be
useful for you someday.

## Use-case

Let's consider we have a React component that is called `AccountCard`. The
responsibility of this component is to display the user's first name, last name and
the avatar.

![User Card](./user-card.png)

```typescript
type AccountCardProps = {
  firstName: string;
  lastName: string;
  avatarURL: string;
}

const AccountCard: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
}) => (
  <div>
    <div>
      <img src={avatarURL} />
    </div>
    <div>
      <label>First name:</label>
      <span>{firstName}</span>

      <label>Last name:</label>
      <span>{lastName}</span>
    </div>
  </div>
)

// usage

// ...

<Account
  firstName="John"
  lastName="Doe"
  avatarURL="https:/example.com/slug-123.png"
/>

// ...
```

## New requirements

Let's imagine we've got a new requirement:

> _Premium Accounts_ should have a small badge indicating that the account is
> _premium_.  As for _regular_ accounts, the user card should stay the same.

Regular Account                   | Premium Account
:--------------------------------:|:------------------------------------------------:
![Account Card](./user-card.png)  |  ![Premium Account Card](./user-card-premium.png)


Basically, we need to add a new _badge_ only if the user's account is _premium_,
otherwise, we just render the component as it was before. It seems straightforward.

To make things more interesting and to **justify why I'm writing this post**,
I'd like to consider the possibility where **the current component `<AccountCard
/>` could be in use by other teams and different places in the app**.

With that said, in order to make the changes, we'll need to make, we will need to
consider our strategy carefully since we don't want to break compatibility with
other teams/areas where this component is already being used.

## Approaches

I can imagine 3 approaches (probably there are more) and I'll try to reason
about the pros and cons of each one.

### 1. Adding a new prop with boolean values

Our goal is to display additional information on top of what is already
there, so one way to approach this is to add a new prop to our component that
indicate that the account is _premium_. In this case, we can simply use a
`boolean` value to indicate whether the account is _premium_ or not:

```typescript
// Let's pretend we have a component that displays the "premium" badge
const PremiumBadge = () => <div>PREMIUM</div>

type AccountCardProps = {
  firstName: string;
  lastName: string;
  avatarURL: string;
  isPremium: boolean; // new prop
}

const Account: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
  isPremium, // new prop
}) => (
  <div>
    <div>
      <img src={avatarURL} />
    </div>
    <div>
      <label>First name:</label>
      <span>{firstName}</span>

      <label>Last name:</label>
      <span>{lastName}</span>
    </div>
    {/* if the value of isPremium is true, display the Premium badge */}
    {isPremium && <PremiumBadge />}
  </div>
)

// usage

// ...

<Account
  firstName="John"
  lastName="Doe"
  avatarURL="https:/example.com/slug-123.png"
  isPremium={true}
/>

// ...
```

#### Pros

>Easy

It is an easy change that gets the job done. If there are no many people
depending on this component and the impact of doing changes is low, I'd consider
this approach in a heartbeat.

#### Cons

>Our component will be subject to change every time we get a new requirement

The example I gave earlier of having to display a _premium_ badge is simple
because either we show a new content or not.  However, software tends to evolve
over time and I wouldn't be surprised if we get to support new use cases in the
future such as:
* display this icon when the user is online.
* display date of birth if a certain condition is met, etc.

Then, every time we get a new requirement will be a new prop and a new "if"
tucked in in the component and every change needs to be well considered given
there is now the risk of **breaking the existing behaviour and impacting other
teams**.

>It can break compatibility with existing code

If our component is being reused by other areas in the codebase, **we will need
to change everywhere** to make sure the new prop is being passed correctly. We
also would need to watch out for regression.

One way to mitigate the risk of breaking things or introducing breaking changes
to other teams is to change the newly added prop to be set as _optional_ and set
its default value to be always `false` so that only the new usage of the code
that needs the new prop `isPremium` will need to change passing `false` or
`true` while places where this component is already in use don't need to change
a thing.

```typescript
type AccountCardProps = {
  firstName: string;
  lastName: string;
  avatarURL: string;
  isPremium?: boolean; // new prop now marked as "optional"
}

const Account: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
  isPremium = false, // new prop
}) => (
// ...
);
```

### 2. Adding a new prop with an enum

As mentioned above, adding new props for every new use case will increase the
the complexity of the component and it will require larger coordination between
developers that already use it.

With that said, let's try changing our data structure in a way that allows the
users of our code to pass down what type of _account_ will be displayed and we
can write our component in a way that we will know what to do based on that.

```typescript
// AccountType represents all possible types of account
enum AccountType {
  Regular,
  Trial,
  Premium,
  Gold,
}

// accountTypeComponentMap takes an AccountType as input and returns a React
// component based on the account type
const accountTypeComponentMap = (
  accountType: AccountType
): React.FunctionComponent => {
  const map = new Map([
    [AccountType.Regular, () => null], // for "regular" accounts, display nothing
    [AccountType.Trial, () => <div>TRIAL ACCOUNT</div>],
    [AccountType.Premium, () => <div>PREMIUM</div>],
    [AccountType.Gold, () => <div>GOLD</div>],
  ])

  // Fetch the component based on the account type
  // return nothing (null) if can't find it.
  return map[accountType] || null;
}

type AccountCardProps = {
  firstName: string;
  lastName: string;
  avatarURL: string;
  accountType: AccountType; // type that represents the account type (i.e.  premium, regular)
}

const Account: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
  accountType,
}) => {
  // Assign the corresponding component based on the account type
  const BadgeComponent = accountTypeComponentMap(accountType)

  return (
    <div>
      <div>
        <img src={avatarURL} />
      </div>
      <div>
        <label>First name:</label>
        <span>{firstName}</span>

        <label>Last name:</label>
        <span>{lastName}</span>
      </div>
      {/* displays the content */}
      <BadgeComponent />
    </div>
  )
}

// usage

// ...

<Account
  firstName="John"
  lastName="Doe"
  avatarURL="https:/example.com/slug-123.png"
  accountType={AccountType.Premium}
/>

// ...
```

#### Pros

>Extensible

This solution opens the possibilities to be able to accommodate new
use cases that are related to different types of accounts. As we have new
types, all we have to do is to include in the list of supported types and add a
a new entry in the map, then add the corresponding rendering logic to it:

i.e.

```typescript
enum AccountType {
  // ...
  Diamond, // new type
}

// accountTypeComponentMap takes an AccountType as input and returns a React
// component based on the account type
const accountTypeComponentMap = (
  accountType: AccountType
): React.FunctionComponent => {
  const map = new Map([
    // ...
    [AccountType.Diamond, () => <div>...</div>],
  ])

  // Fetch the component based on the account type
  // return nothing (null) if can't find it.
  return map[accountType] || null;
}
```

#### Cons

>It can also break compatibility with existing code

As we are adding a new prop, every consumer will need to update the code where
this component is being used to accommodate the `accountType`. Perhaps now the
situation can be trickier because other teams when updating the code, will also
need to know what would be the _default_ account type to be used since depending
on what you pass in, it might render additional content.

To mitigate that, we would need to make sure the documentation is in place and
perhaps have a pre-selected `accountType` if none is given. However, having this
implicit might lead to confusion in the future so I'd choose this approach
carefully.

i.e.

```typescript
type AccountCardProps = {
  // ...
  accountType?: AccountType; // accountType now is optional
}

const Account: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
  accountType = AccountType.Regular, // account type will always be "regular"
}) => {
  // ...
});
```

### 3. Using composition

The implementation of this approach consists of having separate components that
can be combined in order to achieve a broader "concept".

The idea is to extend basic components into more specific ones as needed so that
these components can be opted-in by developers as new features are introduced or
tweaked. This principle is also called [Open-closed
principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle#:~:text=In%20object%2Doriented%20programming%2C%20the,without%20modifying%20its%20source%20code.).
To illustrate this principle applied to our situation, our component is now
**closed for modification**. Meaning that we don't add new code, or at least we
minimise the changes to it. However, we will now make it **open for extension**,
meaning that whenever new requirements come, we extend our component into
something new based on the original one as we would do with _lego bricks_.

Let's see how our code would look like with this approach:

```typescript
type AccountCardProps = {
  firstName: string;
  lastName: string;
  avatarURL: string;
}

const AccountCard: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
}) => (
  <React.Fragment>
    {/* replace <div> by <React.Fragment> */}
    <div>
      <img src={avatarURL} />
    </div>
    <div>
      <label>First name:</label>
      <span>{firstName}</span>

      <label>Last name:</label>
      <span>{lastName}</span>
    </div>
  </React.Fragment>
)

const PremiumAccountCard: React.FunctionComponent<AccountCardProps> = ({
  firstName,
  lastName,
  avatarURL,
}) => (
  <React.Fragment>
    <AccountCard
      firstName={firstName}
      lastName={lastName}
      avatarURL={avatarURL}
    />
    <div>PREMIUM</div>
  </React.Fragment>
)

// usage

// ...

<PremiumAccountCard
  firstName="John"
  lastName="Doe"
  avatarURL="https:/example.com/slug-123.png"
/>

// ...
```

#### Pros

>Flexible

This approach is arguable the most flexible of all, but it can also be
considered as over-engineering. All depends on the problem at hand.

Considering our use case, if the requirement is to just display a new badge when
the user's account is _premium_, breaking the component into a separate
component might be too much. However, this approach can be really powerful
because the original component doesn't need to be changed necessarily,
therefore, the codebase won't be affected as we evolve our software.

#### Cons

>Risk of introducing the wrong abstraction

Although I really like this approach, applying it too soon might hurt the code
design since there is a risk of creating wrong abstractions for something we
don't fully understand yet. If that happens, might be hard to go back to the
simplest state and there is a risk of the "composed" component become a hybrid
beast (generic, but specific, which is pretty much unfortunate, no one wants
that).

More about that:

* [Premature Abstraction](https://wiki.c2.com/?PrematureAbstraction)
* [Yagni](https://martinfowler.com/bliki/Yagni.html)

## Thank you for reading

If you read this far, I hope I didn't waste your time.

I've talked about 3 approaches that I often consider in situations like this and
I don't believe there is a right or wrong approach to follow but I thought would
be beneficial listing a few that came to mind here so it can be referenced later
on as a head start in the case you – _or future me_ – face similar challenges.

I hope you enjoy this post, if you have any feedback or questions, hit me up on
<alabeduarte@gmail.com>, I'd be happy to hear your thoughts and be better next
time!

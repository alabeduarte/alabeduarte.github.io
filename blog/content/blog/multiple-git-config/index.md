---
title: Multiple .gitconfig files
date: "2021-01-20T07:16:30.450Z"
description: "Quick write-up about handling multiple .gitconfig files (personal
and work-related configs)"
---

## What `.gitconfig` is for?

When you set up a new code and uses [Git](https://git-scm.com/) to manage your
version control, unless you are only reading a code of a repository that you
[cloned](https://git-scm.com/docs/git-clone), you will have to add some
configuration to start interacting with Git, which is mainly to tell Git "who
you are" since Git's configurations are per-user.

For this post, let's use the infamous [John
Doe](https://en.wikipedia.org/wiki/John_Doe) as an example. I believe would be
easier if we do some role play/story tell this because we will be discussing
emails, directory names, company names and I'd like to avoid any situation where
could lead you – the reader – to trouble (i.e. wrong filename, etc).

Say John Doe wants to set up Git and have more than one email (personal and work)
and John Doe wants to make sure that the commits are being referenced properly
so that other people might reach out to him directly in case of questions with
changes and all. The challenge is that **the company that John Doe works for
requires every employee to use their work-email** so John Doe needs to pay
attention to his commits.

### Getting started

For a complete guide on how to setup Git, I'd recommend the [official
guide](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup), but
to summarise, running the following commands will get you ready to go:

```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

The command above tells Git about your **identity** which is represented by your
**name** and your **email**. This is important because every Git commit uses
this information.

The `--global` flag means that these configurations will be stored in your
system which will be placed in a file located at `~/.gitconfig`.

_NOTE: without the flag `--global`, the configuration provided will only be
applied to the current directory._

### Checking Your Settings

You can check your current Git settings by typing `git config`:
```
$ git config --list
user.name=John Doe
user.email=johndoe@example.com
```

You also can verify the `~/.gitconfig` file:

```
$ cat ~/.gitconfig

[user]
  name = John Doe
  email = johndoe@example.com
```


## Dealing with multiple configurations

Git's API is big so I might not cover all options here, meaning there might be
other ways to achieve the same thing wich is: **be able to commit code using
appropriate identifications** without the hassle of manually change/check them.

The approach I'd like to share is to use
[includeIf](https://git-scm.com/docs/git-config#_includes).  What `includeIf`
does is to **append** a new peace of config from a different path
**conditionally** so that way, if the conditions are met, an addition to the
existing Git config will be considered when interacting with Git. This is based
on which directory you're on so in order to make the most use of `includeIf` it
is recommended to keep all repositories within a single folder.  For example:

```
- my-workspace/
  - xyz/
    - repository-1/
    - repository-2/
    (...)
```

Considering John Doe works at the company _xyz_ and his email is
_j.doe@xyz.com_, let's create a **new file** containing the additional info that
should only be used for work-related repositories:

#### 1. Create a new file:

```
$ touch ~/my-workspace/xyz/.gitconfig-work
```

#### 2. Add the work-related info to the newly created file:

```
[user]
  name = John Doe
  email = j.doe@xyz.com
```

#### 3. Add conditional config to the global Git config

Now we need to tell Git that, if John Doe is within the work-specific directory
(`~/my-workspace/xyz/` on this case), Git should use a different configuration
instead.

To make that happen, let's change the **system Git config file** located on
`~/.gitconfig` and edit it with the following code:

```
[user]
  name = John Doe
  email = johndoe@example.com
[includeIf "gitdir:~/my-workspace/xyz/"]
  path = ~/my-workspace/xyz/.gitconfig-work
```

## Dealing with different signature keys

Git is cryptographically secure and John Doe does not mess around, he wants to
make sure that every commit is from a trusted source. Git provides a mechanism
where you can [sign your
commits](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work) but now
that John Doe has different Git configurations, we need to find a way to also
setup different signatures depending on the identification (i.e. one signature
for his personal email, another signature for his work's email).

If you're curious to know how to set up a GPG key with git, please read the
[official Git Tools
documentation](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work).
Additionally, I'd recommend the following [this
tutorial](https://docs.github.com/en/github/authenticating-to-github/telling-git-about-your-signing-key)
published by GitHub.

Similarly to the steps, we followed to set up different configs based on the
directory, let's start:

#### 1. Create a new file with "personal" config:

```
$ touch ~/my-workspace/side-projects/.gitconfig-personal
```

#### 2. Add the signature (i.e. in our case, the signature is _SECRET_) to the newly created file:

```
[user]
  signingkey = SECRET
```

#### 3. Add your work-related signature (i.e. _SECRETWORK_ on this case) to your the work-related Git config

```
[user]
  name = John Doe
  email = j.doe@xyz.com
  signingkey = SECRETWORK
```

#### 4. Now let's configure our global `~/.gitconfig` with the following:

```
[includeIf "gitdir:~/my-workspace/xyz/"]
  path = ~/my-workspace/.gitconfig-work"
[includeIf "gitdir:~/my-workspace/side-projects/"]
  path = ~/my-workspace/side-projects/.gitconfig-personal
```

#### 5. All set!

Now, John Doe can commit freely between personal/work-related with ease!

## Thank you for reading

I hope you enjoy this post, if you have any feedback or questions, hit me up on
<alabeduarte@gmail.com>, I'd be happy to hear your thoughts and be better next
time!

---
title: Setting up a new machine
date: "2021-01-08T03:58:16.530Z"
description: "As I became to customise my settings more and more, having to
set up a new environment wasn't an exciting thing to do anymore.  I not only have
to remember to install all of these things that I need, but it became also tedious
and demanded a large cognitive effort.  Also, I got frustrated many times because
I thought I was all set up until I realised I forgot to install a particular
tool. This post shares some things I've learned when comes to automating my
environment setup."
---

## Dang! Got a new laptop and I have to set up everything... again...

I always find it exciting when I get something new, such as a new laptop. When
buying one, changing jobs (assuming the employer provides me one) or replacing
old by new.

The first thing I like to do is to assess the machine's power, see what is made
in terms of memory and disk space. Then, I see how far I can get in terms of
privileges (i.e. can I install/uninstall whatever I want?).

This is important to me because I like to keep things clean and tidy so,
eventually, I can start making my own mess by installing my stuff. During my
career I kind of got a mental list of software I lean on, things that I really
need, other things that I _might_ need and others that I heard that are nice but
I never really used it.

As I became to customise my settings more and more, *having a new machine wasn't
that exciting anymore*. I not only have to remember to install all of these
things that I need, but it became also tedious and demanded a large cognitive
effort.  Also, I got frustrated many times because I thought I was all set up
until I realised I forgot to install a particular tool.

## Consistent environment

The way I now approach this is to automate my setup as much as I can so that
every time I set up a new machine, my development environment will be consistent
each time. In order to make this happen, I like to structure my environment
setup with the following categories:

* Tools
* Access
* Configuration

---

### Tools

I like to go with an approach of running a single command and install everything
I need at once. The operating system that I've been using is macOS but most of
the things that I'll mention here also applies for Linux. In terms of Windows,
probably you will find an equivalent.  What is important here is to stick to the
concept of automation.

What I use to install the tools that I rely on is [Homebrew](https://brew.sh/)
and it is simple as that:

```
$ brew install git
```

_The command above installs `git`, as an example._

You also can use `brew` to install macOS apps (i.e. browser, code editor, image
visualisation, etc) via [Homebrew Cask](https://formulae.brew.sh/cask/)

```
$ brew install --cask firefox
```

When you install something via `brew` (a.k.a Homebrew), the software is now
managed by it. Meaning that whenever you need to upgrade, reinstall or delete,
you can do via homebrew as follows:

```
$ brew upgrade git
```

The good thing about this is that you can now dump all your software list you
ever installed via brew into one file and that can be used to set up a whole new
machine with a single command. You can achieve that with [Homebrew
Bundle](https://github.com/Homebrew/homebrew-bundle).

_Please follow the [official
documentation](https://github.com/Homebrew/homebrew-bundle) to install it
properly._

Once you are all set, you can run the following command that will consolidate
all the things you have installed into a file usually named `Brewfile`:

```
$ brew bundle dump --file=Brewfile
```

Then, the `Brewfile` will look like this:

```
tap "github/gh"
tap "homebrew/bundle"
tap "homebrew/cask"
tap "homebrew/cask-fonts"
tap "homebrew/cask-versions"
tap "homebrew/core"
tap "homebrew/services"
brew "git"
brew "go"
brew "make"
brew "neovim"
brew "tmux"
brew "unzip"
cask "buttercup"
cask "docker"
cask "firefox"
```

Now, imagine you do that now, save this file somewhere (i.e. cloud). When you
receive a new machine or even format your current machine, you can run `brew
bundle` to restore all the software that you used to have. See the command
below:

```
$ brew bundle --file=homebrew/Brewfile
```

The above will install everything as if you were running `brew install git`,
`brew install go`, etc.

### Access

Now you have your stuff in place, there will be a "necessary" pain of
authenticating with most of them (i.e. your cloud storage, your music app). The
way I like to approach this is to get handy a password manager.

_PS: I usually use brew cask to install mine so I don't have to install it
manually ever again_

In case you don't have a password manager, I'd consider downloading one now,
here's
[why](https://www.troyhunt.com/password-managers-dont-have-to-be-perfect-they-just-have-to-be-better-than-not-having-one/).

A few options to consider:

* [1Password](https://1password.com/)
* [Buttercup](https://buttercup.pw)

### Configuration

This category is pretty much to make sure once you are all set up, your tools
are the way you left them before changing machines (or before you restored your
current machine). I personally don't bother too much about browser config
because I have personal accounts that bring my config from the browser's cloud,
but editor configuration is something that is really close to my workflow and if
I don't see my editor or my terminal the way I remembered, I might have a Hard
time trying to remember where things were before becoming productive.

About code editors, you might have seen around some GitHub repo called
`dotfiles`. The reason for this name is because most of the configs are files
that have `.` in front of its name (i.e. `.gitconfig`, `.vim`, `.zshrc`,
`.idea`, etc).

So what most people do, they create a git repository somewhere (i.e. GitHub,
GitLab, Bitbucket, etc) and consolidate all configs into one place so whenever
you clone your repo (from a brand-new machine), you can run a couple of commands
and have your original config in place.

In addition, you can also add customisable scripts to speed up your initial
setting. As an example, VSCode is an editor that you can install a number of
plugins to support your day-to-day development. So, although I'm not a heavy
VSCode user, I use it sometimes and I have a few plugins that help during these
occasions. So I came up with a script that will read all my current plugins and
store them into a file so whenever I set up a new environment, the script will
install all of these plugins so that when I open VSCode, the `settings.json`
will contain all plugins that I used to have in my previous environment. That's
was pretty much inspired by [Homebrew
Bundle](https://github.com/Homebrew/homebrew-bundle)

Here's a snippet:

```
#!/bin/bash

###
# Creates symbolic link from this dir into where vscode is installed
# then reads VSCodeExtensionsFile and install each extension one by one
###
bundle()
{
  # Creates symbolic link
  rm -rf ~/Library/Application\ Support/Code/User/settings.json || true
  ln -s `pwd`/vscode/settings.json ~/Library/Application\ Support/Code/User/settings.json

  # Install extensions
  while read extension; do
    code --install-extension $extension
  done < vscode/VSCodeExtensionsFile

  echo "Done."
}

###
# List vscode extensions and place into VSCodeExtensionsFile file
###
dump()
{
  extensions="vscode/VSCodeExtensionsFile"
  echo "Reading existing extensions from VSCode onto $extensions"
  echo ""

  code --list-extensions | tee $extensions

  echo "Done."
}

$*
```

-- Edited on Wed 20 Jan

If you want to use the the script above, you can copy its content into your
machine with the following steps:

1. Create a file on your `/usr/local/bin` so that you can execute from anywhere

```
$ touch /usr/local/bin/vs-code-bundler
```

2. Grant permission to the script to being executed

```
$ chmod +x /usr/local/bin/vs-code-bundler
```

3. Open the file we created and paste the script

4. Test the script

Run the command below to get your existing extensions and dump into a file.

```
$ vs-code-bundler dump
```

Then check the content of `vscode/VSCodeExtensionsFile` and see if it matches
with your existing extensions:

```
$ cat vscode/VSCodeExtensionsFile
```

Save this file somewhere and next time you can run the `bundle` command to
install everything if you need to:

```
$ vs-code-bundler bundle
```

---

## Conclusion

If you read until now, thank you very much, I hope this article help you somehow
or help someone you know!

I'll share below my personal `dotfiles` where I apply most of the things I've
discussed and feel free to copy & paste and make your own config according to
what makes sense to you.

https://github.com/alabeduarte/dotfiles

If you have any questions or feedback, feel free to email me on
<alabeduarte@gmail.com>.

A few shout outs to friends that helped me and inspired me to do this post:

* [Celso Dantas](https://github.com/celsodantas)
* [Fernando Alves](https://github.com/fernando-alves)
* [Guilherme Tramontina](https://about.me/gtramontina)
* [Marco Valtas](https://marcovaltas.com/about.html)
* [Narciso Benigno](https://github.com/narcisobenigno)

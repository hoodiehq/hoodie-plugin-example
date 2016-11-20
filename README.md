# hoodie-plugin-example

> Dummy code to inform & discuss the implementation of 3rd party plugins

## Background

Extendability was always a crucial feature of the idea behind Hoodie, it’s one
of the biggest advantages over closed source or hosted alternatives.

After working on Hoodie for over two years we gained enough understanding of its
architecture to rebuild it from the ground up, focusing on maintainability and
ease of contribution.

We had to disable plugins and are now working on enabling them again. This
repository is meant as a base of discussion for everyone interested to help
with its implementation

## Blockers

We can start working on 3rd party plugins for extending client API, the
server logic and the web UI immediately. Admin dashboard extensions and
background tasks being out of scope for now.

We are trying to finish up these tasks before implementing the plugins to make
things easier:

- [hapi usage: replace options.db with options.PouchDB](https://github.com/hoodiehq/hoodie/issues/625)
- [Treat Hoodie apps like plugins: add support for client/, server/ and admin/ folders](https://github.com/hoodiehq/discussion/issues/98).
  This will allow us to test this plugin just as if it would be an app itself.

## Notes

- hoodie plugins are npm modules. We recommend a `hoodie-plugin-` package name prefix, but it’s not required. Folder structure:

  ```
  ├── package.json
  └── hoodie
      ├── client.js    # or: hoodie/client/index.js
      ├── server.js    # or: hoodie/server/index.js
      └── public
          └── index.html
   ```

- hoodie plugins can extend the Hoodie client, the Hoodie server, provide a web UI for `/hoodie/<name>` and extend the Hoodie admin dashboard at `/hoodie/admin` (out of scope). Both `hoodie/client` and `hoodie/server` are optional
- The Server plugin must be loadable via `require('hoodie-plugin-foo/hoodie/server')`.
  A Hoodie server plugin is a [hapi plugin](http://hapijs.com/tutorials/plugins)
- The client plugin must be loadable via `require('hoodie-plugin-foo/hoodie/client')`
  A Hoodie client plugin can be a function or an object, it will be passed into [hoodie.plugin()](https://github.com/hoodiehq/hoodie-client#hoodieplugin)
- The `hoodie/public` folder will be exposed at `/hoodie/<name>` by the server if it exists.
- The order in which server/client plugins are loaded is
	1. core modules (account, store, task)
	2. 3rd party plugins (npm dependencies)
	3. app plugins
- `hoodie.plugin.foo` is passed into the server plugin, `hoodie.plugin.foo.client` is passed to the client plugin.
- The `hoodie` package is automatically loading all server & client modules unless they are disabled with config (`hoodie.plugin.foo = false` in `package.json`)
- When using the `@hoodie/server` or `@hoodie/client` packages directly then plugins must be loaded and configured manually.

## Implementation

Loading 3rd party plugins would most likely go into [server/plugins/index.js](https://github.com/hoodiehq/hoodie/blob/8fa80e1b1ac192c18766b2d8e189529f8c003029/server/plugins/index.js).
For comparison see how [@hoodie/server is loading @hoodie/store-server and @hoodie/account-server](https://github.com/hoodiehq/hoodie-server/blob/0b85c1274e020514fc71ff6f256e65579436c9cb/lib/plugins/index.js).

Loading the web UIs can work the same way [we currently load the public folder
of @hoodie/account and @hoodie/store](https://github.com/hoodiehq/hoodie/blob/8fa80e1b1ac192c18766b2d8e189529f8c003029/server/plugins/public.js#L46-L64).
We need to add a check if the folder exists first

The dynamic bundling of the Hoodie client is implemented in [server/plugins/client/bundle.js](https://github.com/hoodiehq/hoodie/blob/8fa80e1b1ac192c18766b2d8e189529f8c003029/server/plugins/client/bundle.js#L54-L75).

This plugin has `hoodie` as devDependency. The idea is that plugins can be started
just like apps, and if they have a `hoodie/public` folder it will be served, and
the server & client will be extended dynamically (see [hoodiehq/discussion#98](https://github.com/hoodiehq/discussion/issues/98))

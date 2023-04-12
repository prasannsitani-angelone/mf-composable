# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

##Debugging

To Debug the server side files with breakpoints/debuggers statement, follow these steps:

1. Run this command:

   ```bash
   npm run dev-debug
   ```

2. Open the chrome developer tools
3. On the top left of chrome developer tool window, you will find a green color node icon. Click on that
4. Clicking on the node icon will open a new debugger window. You will find all your server side breakpoints, debuggers getting executed here. All the server file's console statement output can also be seen in the console tab of this debugger window.

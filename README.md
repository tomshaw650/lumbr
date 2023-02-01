# [Lumbr](https://lumbr.app)

## What is this?
This is the source code for my individual project/dissertation for my BSc in Computer Science at Northumbria. The project is a web application that allows users to create and share 'logs' which encapsulate the creation of a dev artefact; this will usually be a side project like a game or a website. The logs are designed to be a way of documenting the process of creating a project, and to allow users to share their experiences with others. I aim to enrich developer communication and education through this web app, by allowing devs to share their experiences and learn from each other.

## How does it work?
The web app is built using the [`create-t3-app` template](https://create.t3.gg/), which is a template for building NextJS applications. The app is built using TypeScript and styled using TailwindCSS. Tanstack Query is wrapped by tRPC to allow for simple backend functionality. Prisma is used for the database, and the app is deployed using Vercel.
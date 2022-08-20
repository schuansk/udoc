<p align="center">
    <img alt="Gatsby" src="https://raw.githubusercontent.com/schuansk/bucket/main/udoc/assets/logo.png" width="100" />
</p>
<h1 align="center">
  UDOC
</h1>
<p align="center">
  <a href="#why">Why</a> •
  <a href="#technologies-used">Technologies used</a> •
  <a href="#how-to-use">How to use</a> •
  <a href="#license">License</a>
</p>
<h2>
  <img src="https://raw.githubusercontent.com/schuansk/bucket/main/udoc/assets/demo.gif">
</h2>

<p align="center">A simple platform to document your projects.</p>

## Why

<p>At one point, I was tired of taking notes in notepad and at the same time wanted to learn a little about NextJS, so UDOC came along. This is a simple project that aims to help you create documentation for projects. In UDOC it is possible to create Macros (projects) and add pages to it, the documentation.</p>

## Technologies used

- [NextJS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Firebase](https://firebase.google.com/)
- [Sass](https://sass-lang.com/)

## How to use

```bash
  # Clone the repository
  $ git clone

  # Access the project directory
  $ cd udoc

  # Copy and fill environment variables
  $ cp .env.local.example .env.local

  # Run with docker
  $ docker-compose --env-file .env.local up --build

  # Or run with yarn
  $ yarn dev
```

## License

<p>Licensed under <a href="./LICENSE">MIT</a>.</p>

---

<p align="center">Made lovingly by Schuansk Torres ❤️.</p>

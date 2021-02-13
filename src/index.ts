import express from "express";
import fsNormal from "fs";
import fetch from "node-fetch";

const fs = fsNormal.promises;

const app = express();

const footer = `<p>Copyright &copy; Wold Halland Media ${new Date().getFullYear()}</p>`;

app.get("/", async (_req, res) => {
    const layoutBuffer = await fs.readFile(__dirname + "/layout.html");

    const layout = layoutBuffer.toString("utf-8");

    const title = "nr5.no";

    const body = /*html*/ `
  <div class="text-center">
    <h1 class="text-4xl mb-3">nr5.no</h1>
    <p>Image sharing service</p>
  </div>
    `;

    res.send(
        layout
            .replace("{ title }", title)
            .replace("{ body }", body)
            .replace("{ footer }", footer)
            .replace("{ head }", "")
    );
});

app.get("/:slug", async (req, res) => {
    const layoutBuffer = await fs.readFile(__dirname + "/layout.html");

    const layout = layoutBuffer.toString("utf-8");

    const image = `https://cdn.nr5.no/${req.params.slug}`;

    const response = await fetch(image);

    const title = "nr5.no";

    const body = response.ok
        ? `<div class="p-5"><img src="${image}" alt="screen shot" /></div>`
        : '<div><p class="text-center">File not found</p></div>';

    const head = response.ok
        ? /* html */ `
        <meta property="og:title" content="nr5">
        <meta property="og:site_name" content="nr5 image sharing">
        <meta property="og:url" content="nr5.no">
        <meta property="og:description" content="">
        <meta property="og:type" content="object">
        <meta property="og:image" content="${image}">
    `
        : "";
    res.send(
        layout
            .replace("{ title }", title)
            .replace("{ body }", body)
            .replace("{ footer }", footer)
            .replace("{ head }", head)
    );
});

app.listen(Number(process.env.PORT), process.env.HOSTNAME!, () =>
    console.log(
        `Server listening on http://${process.env.HOSTNAME}:${process.env.PORT}`
    )
);

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import docx from "docx";
import { createCV } from './generate.js';

const app = new Koa();
const router = new Router();
const { Packer } = docx;

app.use(bodyParser());
router.post('/generate', async function (ctx) {
    try {
        console.log("Start generate service");
        let body = ctx.request.body;
        const cv = createCV(body.basicInfo, body.photo, body.currentJob, body.workExperience, body.education);
        let base64 = await Packer.toBase64String(cv);
        ctx.body = { resume: base64 };
        ctx.status = 200;
        console.log("Get CV");
    } catch (e) {
        console.error(e);
        ctx.status = 500;
        ctx.body = "Error: " + e.message
    }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
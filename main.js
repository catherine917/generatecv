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
    let { name, email, phoneNumber, countryCode, currentJob, workExperience, education, photo } = ctx.request.body;
    const cv = createCV(name, email, phoneNumber, countryCode, photo, currentJob, workExperience, education);
    let buffer = await Packer.toBuffer(cv);
    ctx.body = buffer;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
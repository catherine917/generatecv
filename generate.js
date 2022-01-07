import * as fs from "fs";
import docx from "docx";

const {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun,
    ImageRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle
} = docx;

fs.readFile('./input.json', 'utf-8', function (err, data) {
    if (err) {
        conslog.error(err);
    }
    let res = JSON.parse(data);
    const cv = createCV(res.name, res.email, res.phone, res.photo, res.currentJob, res.workExperience);
    Packer.toBuffer(cv).then((buffer) => {
        fs.writeFileSync(`${res.name}.docx`, buffer);
    });
});

function createCV(name, email, phone, photo, currentJob, workExperience) {
    let current = {
        startTitle: currentJob.jobTitle,
        startDate: currentJob.startDate,
        endDate: null,
        employer: currentJob.companyNav.name
    }
    workExperience.splice(0, 0, current);
    const document = new Document({
        sections: [
            {
                children: [
                    createTableLayout(name, email, phone, photo),
                    createHeading("Experience"),
                    ...workExperience
                        .map((position) => {
                            const arr = [];

                            arr.push(
                                createInstitutionHeader(
                                    position.employer,
                                    createPositionDateText(position.startDate, position.endDate),
                                ),
                            );
                            arr.push(createRoleText(position.startTitle));

                            return arr;
                        })
                        .reduce((prev, curr) => prev.concat(curr), [])
                ],
            },
        ],
    });

    return document;

}

function createContactInfo(phone, email) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({ text: `Mobile: ${phone}  |  Email: ${email}`, heading: HeadingLevel.HEADING_3 }),
            // new TextRun({ text: `Email: ${email}`, break: 1, heading: HeadingLevel.HEADING_3 })
        ],
        spacing: {
            line: 200,
        },
    });
}
function createPhoto(imageBase64Data) {
    return new Paragraph({
        children: [
            new ImageRun({
                data: Buffer.from(imageBase64Data, "base64"),
                transformation: {
                    width: 150,
                    height: 150,
                }
            })
        ]
    })
}

const borders = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
}

function createTableLayout(name, email, phone, photo) {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [createPhoto(photo)],
                        width: {
                            size: 200,
                            type: WidthType.DXA
                        },
                        borders
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                text: name,
                                heading: HeadingLevel.TITLE,
                                alignment: AlignmentType.CENTER,
                            }),
                            createContactInfo(email, phone)
                        ],
                        borders
                    })
                ],
            }),
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        spacing: {
            after: 1000,
        }
    });
}

function createHeading(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        thematicBreak: true,
    });
}

function createInstitutionHeader(institutionName, dateText) {
    return new Paragraph({
        tabStops: [
            {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
            },
        ],
        children: [
            new TextRun({
                text: institutionName,
                bold: true,
            }),
            new TextRun({
                text: `\t${dateText}`,
                bold: true,
            }),
        ],
    });
}

function createPositionDateText(startDate, endDate) {
    const startDateText = getDate(startDate);
    const endDateText = endDate == null ? "Present" : `${getDate(endDate)}`;

    return `${startDateText} - ${endDateText}`;
}

function getDate(date) {
    let value = date.slice(6, date.length - 2);
    let d = new Date(parseInt(value));
    let year = d.getFullYear();
    let month = getMonthFromInt(d.getMonth() + 1);
    return `${year}.${month}`;
}

function getMonthFromInt(value) {
    switch (value) {
        case 1:
            return "Jan";
        case 2:
            return "Feb";
        case 3:
            return "Mar";
        case 4:
            return "Apr";
        case 5:
            return "May";
        case 6:
            return "Jun";
        case 7:
            return "Jul";
        case 8:
            return "Aug";
        case 9:
            return "Sept";
        case 10:
            return "Oct";
        case 11:
            return "Nov";
        case 12:
            return "Dec";
        default:
            return "N/A";
    }
}


function createRoleText(roleText) {
    return new Paragraph({
        children: [
            new TextRun({
                text: roleText,
                italics: true,
            }),
        ],
    });
}









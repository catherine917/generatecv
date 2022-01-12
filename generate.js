import * as R from 'ramda';
import docx from "docx";

const {
    AlignmentType,
    Document,
    HeadingLevel,
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

// fs.readFile('./input.json', 'utf-8', function (err, data) {
//     if (err) {
//         console.error(err);
//     }
//     let res = JSON.parse(data);
//     let { name, email, phone, photo, currentJob, workExperience, education } = res;
//     const cv = createCV(name, email, phone, photo, currentJob, workExperience, education);
//     Packer.toBuffer(cv).then((buffer) => {
//         fs.writeFileSync(`${res.name}.docx`, buffer);
//     });
// });
export function createCV(name, email, phoneNumber, countryCode, photo, currentJob, workExperience, education) {
    let phone = `(${countryCode}) ${phoneNumber}`;
    let current = {
        startTitle: currentJob.jobTitle,
        startDate: currentJob.startDate,
        endDate: null,
        employer: currentJob.companyNav.name
    };
    workExperience.splice(0, 0, current);
    let educations = handldEducation(education);
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
                        .reduce((prev, curr) => prev.concat(curr), []),
                    createHeading("Education"),
                    ...educations
                        .map((education) => {
                            const arr = [];
                            arr.push(
                                createInstitutionHeader(
                                    education.school,
                                    createPositionDateText(education.startDate, education.endDate),
                                ),
                            );
                            arr.push(createRoleText(`${education.major} - ${education.degree}`));
                            return arr;
                        })
                        .reduce((prev, curr) => prev.concat(curr), []),

                ],
            },
        ],
    });

    return document;

}

function handldEducation(education) {
    let res = [];
    for (let e of education) {
        let o = R.pick(['startDate', 'endDate', 'school', 'majorNav', 'degreeNav'], e);
        o.major = R.replace('major_', '', o.majorNav.mdfExternalCode);
        o.degree = R.replace('degree_', '', o.degreeNav.mdfExternalCode);
        res.push(o);
    }
    return res;
}

function createContactInfo(email, phone) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new TextRun({ text: `Mobile: ${phone}  |  Email: ${email}`, heading: HeadingLevel.HEADING_3 })
        ],
        spacing: {
            before: 400,
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
        }
    });
}

function createHeading(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        thematicBreak: true,
        spacing: {
            before: 600
        }
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
        spacing: {
            before: 200,
            after: 200
        }
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
        ]
    });
}









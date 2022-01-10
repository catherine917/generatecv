import axios from "axios";
import * as fs from "fs";
const request = axios.create({
    baseURL: 'https://qacand-api.hcm.ondemand.com/odata/v2',
});
request.defaults.headers.common['Authorization'] = 'Basic dHpob3UwMUBFQ1NrdW4zSDpJbml0aWFsMQ=='
const USER_ID = '102004'

function getBasicInfo() {
    return request.get(`/PerPerson('${USER_ID}')?$format=json&$expand=personalInfoNav,emailNav,phoneNav`)
}

function getPhoto() {
    return request.get(`/PerPerson('${USER_ID}')/employmentNav?$format=json&$expand=photoNav`);
}

function getCurrentJob() {
    return request.get(`/EmpEmployment(personIdExternal='${USER_ID}',userId='${USER_ID}')/jobInfoNav?$format=json&$expand=companyNav`);
}

function getWorkExperience() {
    return request.get(`/Background_OutsideWorkExperience?$format=json&$filter=userId eq '${USER_ID}'`);
}
function getEducation() {
    return request.get(`/Background_Education?$format=json&$filter=userId eq '${USER_ID}'&$expand=majorNav, degreeNav` );
}

Promise.all([getBasicInfo(), getPhoto(), getCurrentJob(), getWorkExperience(), getEducation()]).then(res => {
    let o = {
        name: res[0].data.d.personalInfoNav.results[0].formalName,
        email: res[0].data.d.emailNav.results[0].emailAddress,
        phone: `(${res[0].data.d.phoneNav.results[0].countryCode}) ${res[0].data.d.phoneNav.results[0].phoneNumber}`,
        photo: res[1].data.d.results[0].photoNav.results[0].photo,
        currentJob: { ...res[2].data.d.results[0] },
        workExperience: res[3].data.d.results,
        education: res[4].data.d.results
    }
    fs.writeFileSync('./input.json', JSON.stringify(o), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}).catch(error => console.log(error));


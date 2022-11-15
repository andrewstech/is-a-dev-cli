const prompts = require('prompts');
const fetch = require("node-fetch");
const wquestions = require('./what-domain');
async function check(domain) {
    //check if var has a value
    if (domain) {
        //if it does, check if it's available

        fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${domain}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'mtgsquad'
            }
        }).then(async(res) => {
            if(res.status && res.status == 404) {
                console.log(`The subdomain: ${domain}.is-a.dev is available!`);
            } else console.log(`The subdomain: ${domain}.is-a.dev is unavailable.`)
        })
    } else {
        //if it doesn't, ask for a domain
        const response = await prompts(wquestions);
        //check if the domain is available
        fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${response.domain}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'mtgsquad'
            }
        }).then(async(res) => {
            if(res.status && res.status == 404) {
                console.log(`The subdomain: ${response.domain}.is-a.dev is available!`);
            } else console.log(`The subdomain: ${response.domain}.is-a.dev is unavailable.`)
        })
    }
}

module.exports = check;
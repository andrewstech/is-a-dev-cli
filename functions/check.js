const prompts = require('prompts');
const fetch = require("node-fetch");
const wquestions = require('./what-domain');
const logger = require('../utils/log');


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
                logger.positive(`The subdomain: ${domain}.is-a.dev is available!`);
            } else logger.negative(`The subdomain: ${domain}.is-a.dev is unavailable.`)
        })
    } else {
        //if it doesn't, ask for a domain
        var response = await prompts(wquestions);
        //check if the domain is available
        var validSubdomain = response.domain.replace(/\.is-a\.dev$/, '');
        fetch(`https://api.github.com/repos/is-a-dev/register/contents/domains/${validSubdomain}.json`, {
            method: 'GET',
            headers: {
                'User-Agent': 'mtgsquad'
            }
        }).then(async(res) => {
            if(res.status && res.status == 404) {
                logger.positive(`The subdomain: ${validSubdomain}.is-a.dev is available!`);
            } else logger.negative(`The subdomain: ${validSubdomain}.is-a.dev is unavailable.`)
        })
    }
}

module.exports = check;
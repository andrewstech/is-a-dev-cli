const prompts = require("prompts");
const fetch = require("node-fetch");
const wquestions = require("./what-domain");

async function check(domain) {
  // Check if var has a value
  if (domain) {
    // If it does, check if it's available
    fetch(
      `https://api.github.com/repos/is-a-dev/register/contents/domains/${domain}.json`,
      {
        method: "GET",
        headers: {
          "User-Agent": "mtgsquad",
        },
      }
    ).then(async (res) => {
      if (res.status && res.status == 404) {
        console.log(`${domain}.is-a.dev is available!`);
      } else console.log(`${domain}.is-a.dev is unavailable.`);
    });
  } else {
    // If it doesn't, ask for a domain
    const response = await prompts(wquestions);
    // Check if the domain is available
    var validSubdomain = response.subdomain.replace(/\.is-a\.dev$/, "");
    fetch(
      `https://api.github.com/repos/is-a-dev/register/contents/domains/${validSubdomain}.json`,
      {
        method: "GET",
        headers: {
          "User-Agent": "mtgsquad",
        },
      }
    ).then(async (res) => {
      if (res.status && res.status == 404) {
        console.log(`The subdomain: ${validSubdomain}.is-a.dev is available!`);
      } else
        console.log(
          `The subdomain: ${validSubdomain}.is-a.dev is unavailable.`
        );
    });
  }
}

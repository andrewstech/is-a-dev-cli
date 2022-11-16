const questions = [
  {
    type: "text",
    name: "subdomain",
    message: "What subdomain would you like?"
  },
  {
    type: "select",
    name: "type",
    message: "What type of record do you want to use?",
    choices: [
      { value: "A" },
      { value: "CNAME" },
      { value: "MX" },
      { value: "TXT" }
    ]
  },
  {
    type: "text",
    name: "Content",
    message: "What is the content of the record?"
  }
];

module.exports = questions;

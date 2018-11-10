/**
 * @file This file is for demonstration purpose
 */
const inputUrl = document.getElementById('input-url') as HTMLInputElement
const inputPassword = document.getElementById('input-password') as HTMLInputElement
const textareaSchema = document.getElementById('textarea-schema') as HTMLTextAreaElement
const buttonLaunch = document.getElementById('button-launch') as HTMLButtonElement
const divOutput = document.getElementById('div-output') as HTMLDivElement

// Initial value
inputUrl.value = 'https://httpbin.org/anything'
inputPassword.value = '/passwords.txt'
textareaSchema.value = JSON.stringify(
  {
    name: 'bob',
    password: '$password$',
  },
  null,
  2
)

buttonLaunch.addEventListener('click', () => {
  divOutput.textContent = ''
  launchAttck().catch((err) => {
    console.error(err)
    divOutput.textContent = err
  })
})

async function launchAttck() {
  const attack = new Attacker(inputUrl.value)
  await attack.loadDictionary(inputPassword.value)
  await attack.defineSchema(textareaSchema.value)
  const res = await attack.launchAttack()
  for (const responce of res) {
    console.log(responce)
    divOutput.textContent = divOutput.textContent + '\n' + responce
  }
}

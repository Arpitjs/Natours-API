let login = async (email, password) => {
    try {
   let res =  await axios({
        method: 'POST',
        url: 'http://127.0.0.1:4200/api/v1/users/login',
        data: { email, password }
    })

    if(res.data.status === 'success') {
        alert('logged in successfully!')
        window.setTimeout(() => location.assign('/'), 1500)
    }
    console.log(res)
} catch (err) { alert(err.response.data.message) }
}

document.querySelector('.form').addEventListener('submit', e => {
e.preventDefault()
let email = document.getElementById('email').value
let password = document.getElementById('password').value
login(email, password)
})
// type is either success or error
let hideAlert = () => {
    let el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

let showAlert = (type, msg) => {
    hideAlert()
    let markUp = `<div class="alert alert--${type}">${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp)

    setTimeout(hideAlert, 5000);
}

let login = async (email, password) => {
    try {
        let res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:4200/api/v1/users/login',
            data: { email, password }
        })

        if (res.data.status === 'success') {
            showAlert('success', 'logged in successfully')
            window.setTimeout(() => location.assign('/'), 1500)
        }
        console.log(res)
    }
    catch (err) { showAlert('error', err.response.data.message) }
}

if (document.querySelector('.form'))
    document.querySelector('.form').addEventListener('submit', e => {
        e.preventDefault()
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
        login(email, password)
    })

let logout = async () => {
    try {
        let res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:4200/api/v1/users/logout',
        })
        if (res.data.status = 'success') location.reload(true)
    } catch (e) {
        showAlert('error', 'error logging out, try again!')
    }
}

let logoutBtn = document.querySelector('.nav__el--logout')

if(logoutBtn) logoutBtn.addEventListener('click', logout)
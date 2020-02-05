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
            url: '/api/v1/users/login',
            data: { email, password }
        })
        if (res.data.status === 'success') {
            showAlert('success', 'logged in successfully')
            window.setTimeout(() => location.assign('/'), 1500)
        }
    }
    catch (err) { 
        showAlert('error', err.response.data.message) }
}

if (document.querySelector('.form--login'))
    document.querySelector('.form--login').addEventListener('submit', e => {
        e.preventDefault()
        let email = document.getElementById('email').value
        let password = document.getElementById('password').value
        login(email, password)
    })

let logout = async () => {
    try {
        await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        })
        window.setTimeout(() => location.assign('/'), 0)
    } catch (e) {
        showAlert('error', 'error logging out, try again!')
    }
}

let logoutBtn = document.querySelector('.nav__el--logout')

if(logoutBtn) logoutBtn.addEventListener('click', logout)
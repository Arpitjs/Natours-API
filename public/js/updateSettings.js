let hideAlerts = () => {
    let el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

let showAlerts = (type, msg) => {
    hideAlerts()
    let markUp = `<div class="alert alert--${type}">${msg}</div>`
    document.querySelector('body').insertAdjacentHTML('afterbegin', markUp)

    setTimeout(hideAlerts, 5000);
}

// type is either password or data
let updateSettings = async (data, type) => {
    try {
        let url = type === 'password' ? '/api/v1/users/updatePassword' : '/api/v1/users/updateMe'
        let res = await axios({
            method: 'PATCH',
            url, data
        })
        if (res.data.status === 'success') {
            showAlerts('success', `${type.toUpperCase()} updated successfully!`)
        }
    } catch (err) {
        showAlerts('error', err.response.data.message)
    }
}

if (document.querySelector('.form-user-data')) {
    document.querySelector('.form-user-data').addEventListener('submit', e => {
        e.preventDefault()
        let form = new FormData()
        form.append('name', document.querySelector('#name').value)
        form.append('email', document.querySelector('#email').value)
        form.append('photo', document.querySelector('#photo').files[0])
        console.log(form)
        updateSettings(form, 'data')
    })
}

if(document.querySelector('.form-user-password')) {
    document.querySelector('.form-user-password').addEventListener('submit', async e => {
        e.preventDefault()
        document.querySelector('.btn--save-password').textContent = 'updating..'
        let passwordCurrent = document.querySelector('#password-current').value
        let password = document.querySelector('#password').value
        let confirmPassword = document.querySelector('#password-confirm').value
        await updateSettings({passwordCurrent, password, confirmPassword}, 'password')
        
        document.querySelector('.btn--save-password').textContent = 'save password'
        document.querySelector('#password-current').value = ''
        document.querySelector('#password').value = ''
        document.querySelector('#password-confirm').value = ''
    })
}
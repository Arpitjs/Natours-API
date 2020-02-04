let stripe = Stripe('pk_test_W1xbj7Jn7t923dbIngF8Z84I00xZIaJKgV')

let bookTour = async tourId => {
    // 1 get the session from backend
    try {
        let session = await axios({
            url: `/api/v1/bookings/checkout-session/${tourId}`
        })

        console.log(session)
        // 2 use stripe object to create the checkout form and charge credit card
        await stripe.redirectToCheckout({ sessionId: session.data.session.id })
    } catch (e) {
        console.log(e)
    }
}

let bookBtn = document.getElementById('book-tour')

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.preventDefault()
        e.target.textContent = 'booking tour...'
        let tourId = e.target.dataset.tourId
        bookTour(tourId)
    })
}
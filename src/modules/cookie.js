// Browser cookie utilities for persisting user preferences

// Store a cookie with 365-day expiration
function setCookie (cname, cvalue) {
  const days = 365
  const d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = d.toUTCString()
  document.cookie = `${cname}=${cvalue};expires=${expires};path=/;SameSite=Strict;`
}

// Retrieve a cookie value by name
function getCookie (cname) {
  const name = `${cname}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

export { setCookie, getCookie }

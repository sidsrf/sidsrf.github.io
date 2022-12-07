// codeforces

const cfPPdiv = document.getElementById("cfPP");
const cStatsdiv = document.getElementById("currentStats");
const mStatsdiv = document.getElementById("maxStats");
const cfnamediv = document.getElementById("cfname");
const cfprofilebtn = document.getElementById("cfprofile")

const fetchCFProfile = async (handle) => {
    let respsonse = await fetch("https://codeforces.com/api/user.info?handles=" + handle);
    let data = await respsonse.text();
    let user = JSON.parse(data)['result'][0]
    const fullName = user['firstName'] + " " + user['lastName']
    const cRating = user['rating']
    const cRank = user['rank']
    const mRating = user['maxRating']
    const mRank = user['maxRank']
    const avatar = user['avatar']
    genCFCard(handle, fullName, cRating, cRank, mRating, mRank, avatar)
}

const genCFCard = (handle, name, cRating, cRank, mRating, mRank, avatar) => {
    cfPPdiv['src'] = avatar
    cfnamediv.innerHTML = name
    cStatsdiv.innerHTML = cRank + ' - ' + cRating
    mStatsdiv.innerHTML = mRank + ' - ' + mRating
    cfprofilebtn['href'] = 'https://codeforces.com/profile/' + handle
}

fetchCFProfile('sidsrf')
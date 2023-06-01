// 설정부분

// 디스코드 유저 아이디 적는곳
let discordUserId = "1111870132206190662"

// failback image (디스코드 서버 터지면 보여줄 사진)
let failbackProfileImage = "https://cdn.discordapp.com/attachments/1111921653585285141/1113752790800543764/fac7fd96e2ea85be2ae4bef107aaa3f6-removebg-preview.png"

// 설정부분 끝



// fetch function
async function fetchAsync (url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

// 바닥에서 뜨는 메시지
let snakbar = document.getElementById("snakbar")
let snakbarContent = document.getElementById("snakbar-content")
let snakbarCount = 0
function showSnakbar(message) {
    snakbar.classList.add("open")
    snakbarContent.textContent = message
    let nowCount = ++snakbarCount
    setTimeout(()=>{
        if (nowCount == snakbarCount) {
            snakbar.classList.remove("open")
        }
    },4000)
}

// 디코상태 정하기
let discordName = false
async function discordMain() {
    const profilePictureImage = document.getElementById("profile-picture")
    const profileStatus = document.getElementById("profile-status")
    const profileStatusHoverText = document.getElementById("profile-status-hovertext")
    const profileName = document.getElementById("profile-name")
    const profileTag = document.getElementById("profile-tag")
    const discordButton = document.getElementById("discord-button")
    
    function failback() {
        console.log("Failed to loading user information from discord api! try to set user data with default data (FAILBACK)")
        profileStatus.setAttribute("status","none")
        profilePictureImage.setAttribute("src",failbackProfileImage)
        profileName.textContent = "Helmet"
    }

    try {
        let discordData = (await fetchAsync(`https://api.lanyard.rest/v1/users/${discordUserId}`))?.data
        // console.log(discordData)
        if (discordData) {
            // 상태
            profileStatus.setAttribute("status",discordData.discord_status)
            profileStatusHoverText.textContent = (
                discordData.discord_status == "dnd"     ? "방해 금지모드" :
                discordData.discord_status == "online"  ? "온라인" :
                discordData.discord_status == "idle"    ? "자리비움" :
                discordData.discord_status == "offline" ? "오프라인" :
                "알 수 없음"
            )

            let user = discordData.discord_user
            if (user) {
                // 프로필 이미지 설정
                let avatar = user.avatar
                profilePictureImage.setAttribute("src",
                    `https://cdn.discordapp.com/avatars/${discordUserId}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}?size=2048`
                )

                // 이름설정
                profileName.textContent = user.username
                profileTag.textContent = '#'+user.discriminator

                // 클립보드에 이름 복사
                if (discordButton) {
                    discordName = `${user.username}#${user.discriminator}`
                    discordButton.addEventListener('click',()=>{
                        navigator.clipboard.writeText(discordName)
                        showSnakbar("클립보드에 복사됨 ^o^")
                    })
                }
            }
        } else { failback() }
    } catch (err) {
        console.log(err)
        failback()
    }
}
discordMain()

// 마우스 호버텍스트
function handleHovertext() {
    let hoverItem = document.querySelector(".hover-item")
    let hoverItemText = hoverItem.querySelector(".hover-text")
    document.querySelectorAll(".hover-parent").forEach(hoverParent=>{
        let text = hoverParent.querySelector(".hover-text")
        hoverParent.addEventListener("mousemove",event=>{
            event = event || window.event
            hoverItem.style.left = event.pageX+12+"px"
            hoverItem.style.top = event.pageY+12+"px"
        })
        hoverParent.addEventListener("mouseover",()=>{
            hoverItemText.textContent = text.textContent
            hoverItem.classList.add("hover-onhover")
        })
        hoverParent.addEventListener("mouseout",()=>{
            hoverItemText.textContent = text.textContent
            hoverItem.classList.remove("hover-onhover")
        })
    })
}
handleHovertext()

// 初期メンバーリスト
let members = ["hinode", "yottu", "cook", "kyu-chan", "naru"];
        
// 選出された司会と書記
let selectedChairman = "";
let selectedSecretary = "";

// ページ読み込み時に実行
window.onload = function() {
    loadMembers();
    document.getElementById('runButton').addEventListener('click', selectRandomPeople);
    document.getElementById('copyButton').addEventListener('click', copyResults);
};

// Enterキーで追加できるようにする
function handleKeyPress(event) {
    if (event.key === "Enter") {
        addMember();
    }
}

// メンバーを表示する
function loadMembers() {
    const memberListElement = document.getElementById('memberList');
    memberListElement.innerHTML = '';
    
    if (members.length === 0) {
        memberListElement.innerHTML = '<p>メンバーがいません。メンバーを追加してください。</p>';
        return;
    }
    
    members.forEach((member, index) => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <span class="member-name">${member}</span>
            <button class="delete-button" onclick="deleteMember(${index})">✕</button>
        `;
        memberListElement.appendChild(memberItem);
    });
}

// 新しいメンバーを追加
function addMember() {
    const newMemberInput = document.getElementById('newMember');
    const newMember = newMemberInput.value.trim();
    
    if (newMember === '') {
        return;
    }
    
    members.push(newMember);
    newMemberInput.value = '';
    loadMembers();
}

// メンバーを削除
function deleteMember(index) {
    members.splice(index, 1);
    loadMembers();
}

function selectRandomPeople() {
    // メンバーが2人未満の場合はエラーメッセージを表示
    if (members.length < 2) {
        document.getElementById('resultArea').innerHTML = 
            '<p style="color: red;">メンバーは最低2人必要です。</p>';
        document.getElementById('copyButton').style.display = 'none';
        return;
    }
    
    // ランダムに司会を選出
    const chairmanIndex = Math.floor(Math.random() * members.length);
    selectedChairman = members[chairmanIndex];
    
    // 司会を除外して書記を選出（同じ人にならないようにする）
    const remainingMembers = [...members];
    remainingMembers.splice(chairmanIndex, 1);
    const secretaryIndex = Math.floor(Math.random() * remainingMembers.length);
    selectedSecretary = remainingMembers[secretaryIndex];
    
    // 結果を表示
    document.getElementById('resultArea').innerHTML = `
        <div class="chairman">
            <p>司会:</p>
            <p class="highlight">${selectedChairman}</p>
        </div>
        <div class="secretary">
            <p>書記:</p>
            <p class="highlight">${selectedSecretary}</p>
        </div>
    `;
    
    // コピーボタンを表示
    document.getElementById('copyButton').style.display = 'flex';
}

// 結果をクリップボードにコピー
function copyResults() {
    if (!selectedChairman || !selectedSecretary) return;
    
    const textToCopy = `司会：${selectedChairman}\n書記：${selectedSecretary}`;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert('結果をクリップボードにコピーしました');
        })
        .catch(err => {
            console.error('クリップボードへのコピーに失敗しました', err);
            alert('コピーに失敗しました');
        });
    }

function addAgendaItem(title = '', details = ['']) {
    const agendaList = document.getElementById('agendaList');
    
    const agendaItem = document.createElement('div');
    agendaItem.className = 'agenda-item';
    
    const detailLines = details.map(detail => `
        <div class="detail-line">
            <input type="text" class="agenda-detail" placeholder="詳細内容" value="${detail}">
            <button onclick="this.parentElement.remove()">✕</button>
        </div>
    `).join('');
    
    agendaItem.innerHTML = `
        <input type="text" class="agenda-title" placeholder="議題タイトル" value="${title}">
        <div class="detail-container">
            ${detailLines}
        </div>
        <button onclick="addDetailLine(this)"><i class="fa-solid fa-plus"></i>行を追加</button>
        <button class="delete-button" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash-can"></i> 議題削除</button>
    `;
    
    agendaList.appendChild(agendaItem);
}
    
function addDetailLine(button) {
    const container = button.previousElementSibling; // .detail-container
    const newLine = document.createElement('div');
    newLine.className = 'detail-line';
    newLine.innerHTML = `
        <input type="text" class="agenda-detail" placeholder="詳細内容">
        <button onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;
    container.appendChild(newLine);
}
    

function generateFormattedMinutes() {
    const date = document.getElementById('meetingDate').value.trim();
    const title = document.getElementById('meetingTitle').value.trim();
    const chairman = document.getElementById('chairmanName').value.trim();
    const secretary = document.getElementById('secretaryName').value.trim();
    
    const agendaItems = document.querySelectorAll('.agenda-item');
    let formattedAgenda = '';
    agendaItems.forEach((item, index) => {
        const heading = item.querySelector('.agenda-title').value.trim();
        const details = item.querySelectorAll('.agenda-detail');
        const detailLines = Array.from(details)
            .map(d => d.value.trim())
            .filter(line => line !== '');

        formattedAgenda += `${index + 1}. ${heading}\n`;
        
        detailLines.forEach((line, i) => {
            const letter = String.fromCharCode(97 + i); // 97は 'a'
            formattedAgenda += `　${letter}. ${line}\n`;
        });
        
        formattedAgenda += `\n`;
    });
    
    const formatted = `${date}　${title}
司会 : ${chairman}
書記 : ${secretary}

${formattedAgenda}`;

    document.getElementById('formattedOutput').value = formatted;
}
    
function copyFormattedMinutes() {
    const text = document.getElementById('formattedOutput').value;
    navigator.clipboard.writeText(text)
        .then(() => alert('議事録をコピーしました！'))
        .catch(err => alert('コピーに失敗しました: ' + err));
}

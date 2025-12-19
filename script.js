let futsalFields = [
  { id: 1, name: "International Futsal", area: "Jakarta Barat", pricePerHour: 120000, image: "https://i.pinimg.com/1200x/07/83/be/0783bea569937befccb7b6f1a9ca7905.jpg" },
  { id: 2, name: "Arena 5 Futsal", area: "Jakarta Selatan", pricePerHour: 150000, image: "https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg" },
  { id: 3, name: "Urban Kick Futsal", area: "Jakarta Timur", pricePerHour: 90000, image: "https://i.pinimg.com/1200x/6d/f5/88/6df588510bcc0faade4d9682b607dc76.jpg" },
  { id: 4, name: "Bansun Futsal", area: "Jakarta Utara", pricePerHour: 110000, image: "https://i.pinimg.com/1200x/66/cd/c7/66cdc760ef7c4403cbebc0532afa9bd3.jpg" },
  { id: 5, name: "Turf Arena", area: "Jakarta Utara", pricePerHour: 145000, image: "https://lantai.id/wp-content/uploads/2023/07/Lantai-Lapangan-Futsal.jpg" },
  { id: 6, name: "DeFutsal", area: "Jakarta Barat", pricePerHour: 80000, image: "https://i.pinimg.com/1200x/1f/67/40/1f67403cd132186eaf9a7ee115bf62d5.jpg" },
  { id: 7, name: "Striker Arena", area: "Jakarta Utara", pricePerHour: 105000, image: "https://i.pinimg.com/736x/2e/59/e7/2e59e7b35c0f0b442299260081c508b8.jpg" },
  { id: 8, name: "Satrio Futsal", area: "Jakarta Utara", pricePerHour: 115000, image: "https://i.pinimg.com/736x/8e/90/6d/8e906d3fd58c6ffa5c49ac8b6c46f586.jpg" },
  { id: 9, name: "Tebet Futsal Park", area: "Jakarta Selatan", pricePerHour: 140000, image: "https://i.pinimg.com/736x/5a/32/21/5a3221d87e11ed14ca6e17a8cceefd7f.jpg" },
  { id: 10, name: "Vertex Futsal", area: "Jakarta Pusat", pricePerHour: 125000, image: "https://i.pinimg.com/1200x/1d/c1/80/1dc1804987443d6125078dd17ce65045.jpg" },
  { id: 11, name: "Rex Futsal Center", area: "Jakarta Timur", pricePerHour: 95000, image: "https://i.pinimg.com/736x/c3/7d/34/c37d34ee7f0397db2dc169be2f8102e9.jpg" },
  { id: 12, name: "Alter Ego Futsal", area: "Jakarta Utara", pricePerHour: 135000, image: "https://i.pinimg.com/1200x/9f/2a/9b/9f2a9ba1a2eaed8445b01c13a4c8b439.jpg" },
  { id: 13, name: "Evos Arena", area: "Jakarta Selatan", pricePerHour: 130000, image: "https://i.pinimg.com/1200x/85/1d/64/851d648c4be71c08db62fc7f61ab324b.jpg" }
];

let cart = [];

// FUNGSI MENAMPILKAN DATA
function displayFields(fieldsToDisplay) {
    let fieldListDiv = document.getElementById("fieldList");
    fieldListDiv.innerHTML = "";
    fieldsToDisplay.forEach(field => {
        fieldListDiv.innerHTML += `
            <div class="card">
                <img src="${field.image}" alt="${field.name}">
                <div class="card-content">
                    <h3>${field.name}</h3>
                    <p class="area">${field.area}</p>
                    <p class="price">Rp ${field.pricePerHour.toLocaleString('id-ID')} / jam</p>
                    <button onclick="addToCart(${field.id})">Tambah ke Keranjang</button>
                </div>
            </div>`;
    });
}

let bookedSlots = {}; 

function addToCart(id) {
    window.selectedDate = ""; 
    
    const modal = document.getElementById("authModal");
    modal.style.display = "block";

    renderJadwal(id);
}

function confirmBooking(fieldId, rentangWaktu) {
    const field = futsalFields.find(f => f.id === fieldId);
    const tanggal = window.selectedDate;
    const slotID = `${fieldId}-${tanggal}-${rentangWaktu}`;

    const indexDiKeranjang = cart.findIndex(item => item.slotID === slotID);

    if (indexDiKeranjang !== -1) {
        cart.splice(indexDiKeranjang, 1);
    } else {
        cart.push({
            ...field,
            selectedDate: tanggal, 
            selectedTime: rentangWaktu,
            slotID: slotID
        });
    }

    updateCartUI();
    renderJadwal(fieldId); 
}

function renderJadwal(fieldId) {
    const field = futsalFields.find(f => f.id === fieldId);
    const content = document.getElementById("authContent");
    
    
    document.getElementById("authModal").style.display = "block";


    let tempDate = window.selectedDate || "";

    let htmlContent = `
        <h2 style="margin-bottom:5px;">Reservasi Lapangan</h2>
        <p style="color:var(--secondary-blue); font-weight:bold; margin-bottom:20px;">${field.name}</p>
        
        <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 10px;">
            <label style="display:block; font-size:14px; font-weight:600; margin-bottom:8px;">1. Pilih Tanggal Terlebih Dahulu:</label>
            <input type="date" id="bookingDate" class="auth-input" 
                   value="${tempDate}" 
                   min="${new Date().toISOString().split('T')[0]}"
                   onchange="updateSelectedDate(this.value, ${fieldId})"
                   style="margin:0; border: 2px solid var(--secondary-blue);">
        </div>
    `;

    
    if (tempDate) {
        let timeButtons = "";
        for (let i = 7; i <= 21; i++) {
            let jamMulai = `${i.toString().padStart(2, '0')}.00`;
            let jamSelesai = `${(i + 1).toString().padStart(2, '0')}.00`;
            let labelWaktu = `${jamMulai} - ${jamSelesai}`;
            let slotID = `${fieldId}-${tempDate}-${labelWaktu}`;
            
            const isSelected = cart.some(item => item.slotID === slotID);
            const buttonClass = isSelected ? "time-slot-btn selected" : "time-slot-btn";
            const text = isSelected ? "✓ " + labelWaktu : labelWaktu;

            timeButtons += `<button class="${buttonClass}" onclick="confirmBooking(${fieldId}, '${labelWaktu}')">${text}</button>`;
        }

        htmlContent += `
            <label style="display:block; font-size:14px; font-weight:600; margin-bottom:8px;">2. Pilih Jam Main:</label>
            <div class="time-grid">${timeButtons}</div>
            <button onclick="document.getElementById('authModal').style.display='none'" class="checkout-btn" style="margin-top:20px; background:#2ecc71">Selesai & Simpan</button>
        `;
    } else {
        htmlContent += `
            <p style="text-align:center; color:#666; font-style:italic; margin-top:20px;">
                Silakan pilih tanggal untuk melihat ketersediaan jam.
            </p>
        `;
    }

    content.innerHTML = htmlContent;
}


function updateSelectedDate(date, fieldId) {
    window.selectedDate = date;
    renderJadwal(fieldId);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    let cartItemsDiv = document.getElementById("cartItems");
    let totalPrice = 0;
    cartItemsDiv.innerHTML = cart.length === 0 ? "<p>Keranjang masih kosong...</p>" : "";

    const groupedCart = cart.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = { ...item, times: [item.selectedTime], totalSesiHarga: item.pricePerHour };
        } else {
            acc[item.id].times.push(item.selectedTime);
            acc[item.id].totalSesiHarga += item.pricePerHour;
        }
        return acc;
    }, {});

    const jumlahLapanganUnik = Object.keys(groupedCart).length;
    document.getElementById("cartCount").innerText = jumlahLapanganUnik;

        Object.values(groupedCart).forEach((item) => {
        totalPrice += item.totalSesiHarga;
        
const sortedTimes = item.times.sort();
const startTime = sortedTimes[0].split(" - ")[0];
const endTime = sortedTimes[sortedTimes.length - 1].split(" - ")[1];
const displayTime = startTime === endTime ? sortedTimes[0] : `${startTime} - ${endTime}`;

cartItemsDiv.innerHTML += `
    <div class="cart-item" style="border-left: 4px solid var(--secondary-blue); padding-left: 15px; margin-bottom: 10px;">
        <div class="item-info">
            <small style="background: var(--primary-blue); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                📅 ${item.selectedDate}
            </small><br>
            <strong style="font-size: 16px;">${item.name}</strong><br>
            <span class="item-time">⏱ ${displayTime}</span>
        </div>
        <button onclick="removeAllSessions(${item.id})" class="delete-btn">Hapus</button>
    </div>`;
    });

    document.getElementById("totalPrice").innerText = totalPrice.toLocaleString('id-ID');
}

function removeAllSessions(fieldId) {
    // Filter keranjang: buang semua yang ID lapangannya sama
    cart = cart.filter(item => item.id !== fieldId);
    
    updateCartUI();
    
    // Jika modal jadwal sedang terbuka, render ulang agar warna tombol kembali putih
    if (document.getElementById("authModal").style.display === "block") {
        renderJadwal(fieldId);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    const qrisDiv = document.getElementById("qrisSection");
    const btn = document.getElementById("mainCheckoutBtn");

    if (modal.style.display === "block") {
        modal.style.display = "none";
        if(qrisDiv) qrisDiv.style.display = "none";
        if(btn) btn.innerText = "Bayar Sekarang (QRIS)";
    } else {
        modal.style.display = "block";
    }
}

// LOGIKA PEMBAYARAN QRIS
function prosesPembayaran() {
    if (cart.length === 0) return alert("Keranjang kosong!");

    // CEK KONDISI LOGIN
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        alert("Anda harus Login atau Daftar terlebih dahulu untuk melakukan pembayaran.");
        toggleCart(); // Tutup keranjang
        toggleAuth('login'); // Buka modal login
        return; // Hentikan fungsi agar QRIS tidak muncul
    }

    // JIKA SUDAH LOGIN, LANJUTKAN KE QRIS
    const qrisDiv = document.getElementById("qrisSection");
    const btn = document.getElementById("mainCheckoutBtn");

    if (qrisDiv.style.display === "none") {
        qrisDiv.style.display = "block";
        btn.innerText = "Konfirmasi Sudah Bayar";
        btn.style.background = "#0d47a1";
    } else {
        alert("Terima kasih! Pembayaran Anda sedang diverifikasi. Silakan cek riwayat pesanan Anda nanti.");
        cart = [];
        updateCartUI();
        toggleCart();
    }
}

// FUNGSI UNTUK MENAMPILKAN MODAL LOGIN/DAFTAR
function toggleAuth(mode) {
    const modal = document.getElementById("authModal");
    const content = document.getElementById("authContent");
    
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
        if (mode === 'login') {
            content.innerHTML = `
                <h2>Login</h2>
                <input type="email" id="loginEmail" placeholder="Email" class="auth-input">
                <input type="password" id="loginPass" placeholder="Password" class="auth-input">
                <button class="checkout-btn" onclick="prosesLogin()">Masuk</button>
                <p style="margin-top:15px; font-size:14px;">Belum punya akun? <a href="#" onclick="toggleAuth('daftar')">Daftar di sini</a></p>
            `;
        } else {
            content.innerHTML = `
                <h2>Daftar Akun</h2>
                <input type="text" id="regNama" placeholder="Nama Lengkap" class="auth-input">
                <input type="email" id="regEmail" placeholder="Email" class="auth-input">
                <input type="password" id="regPass" placeholder="Buat Password" class="auth-input">
                <button class="checkout-btn" style="background:#2ecc71" onclick="prosesDaftar()">Daftar Sekarang</button>
            `;
        }
    }
}

// LOGIKA MENDAFTAR (Simpan ke LocalStorage)
function prosesDaftar() {
    const nama = document.getElementById('regNama').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    if (!nama || !email || !pass) return alert("Harap isi semua bidang!");

    // Ambil data user yang sudah ada atau buat array baru
    let users = JSON.parse(localStorage.getItem('futsalUsers')) || [];

    // Cek apakah email sudah terdaftar
    const isExist = users.find(u => u.email === email);
    if (isExist) return alert("Email ini sudah terdaftar!");

    // Simpan user baru
    users.push({ nama, email, pass });
    localStorage.setItem('futsalUsers', JSON.stringify(users));

    alert("Pendaftaran Berhasil! Silakan Login.");
    toggleAuth('login'); // Arahkan ke form login
}

// LOGIKA LOGIN (Cek ke LocalStorage)
function prosesLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    let users = JSON.parse(localStorage.getItem('futsalUsers')) || [];

    // Cari user berdasarkan email dan password
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        alert("Selamat Datang, " + user.nama + "!");
        localStorage.setItem('isLoggedIn', 'true'); // Simpan status login
        localStorage.setItem('currentUser', user.nama);
        location.reload(); // Refresh untuk update tampilan navbar
    } else {
        alert("Email atau Password salah! Pastikan Anda sudah mendaftar.");
    }
}

// LOGIKA FILTER
function filterFields() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const area = document.getElementById('areaFilter').value;
    const filtered = futsalFields.filter(f => 
        f.name.toLowerCase().includes(search) && (area === 'all' || f.area === area)
    );
    displayFields(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    displayFields(futsalFields);
    
    // Cek status login saat halaman dimuat
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('currentUser');
    
    if (isLoggedIn === 'true') {
        const navRight = document.querySelector('.nav-right');
        // Ganti tombol Daftar & Login dengan Nama User dan Logout
        navRight.innerHTML = `
            <button id="cartBtn" class="cart-icon-btn" onclick="toggleCart()">
                🛒 <span id="cartCount">0</span>
            </button>
            <span style="color:white; font-weight:bold;">Halo, ${userName}</span>
            <a href="#" class="nav-link" onclick="logout()" style="color:#ff5252">Logout</a>
        `;
    }

    document.getElementById('searchInput').addEventListener('keyup', filterFields);
    document.getElementById('areaFilter').addEventListener('change', filterFields);
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    alert("Berhasil Logout");
    location.reload();
}
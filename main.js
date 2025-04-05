// DOM Elements
const elements = {
  // Input Fields
  title: document.getElementById("title"),
  price: document.getElementById("price"),
  taxes: document.getElementById("taxes"),
  ads: document.getElementById("ads"),
  rest: document.getElementById("rest"),
  total: document.getElementById("total"),
  category: document.getElementById("category"),
  lensCategory: document.getElementById("lensCategory"),
  imageInput: document.getElementById("imageInput"),
  selectedImage: document.getElementById("selectedImage"),

  // Buttons
  submit: document.getElementById("submit"),
  convertBtn: document.getElementById("convertBtn"),
  exportExcel: document.getElementById("exportExcel"),
  analyzeBtn: document.getElementById("analyzeBtn"),

  // Table Elements
  tbody: document.getElementById("customerTableBody"),
  deleteAll: document.getElementById("deleteAll"),
  search: document.getElementById("search"),

  // Modals
  passwordModal: document.getElementById("passwordModal"),
  passwordInput: document.getElementById("passwordInput"),
  submitPassword: document.getElementById("submitPassword"),
  passwordError: document.getElementById("passwordError"),
  togglePassword: document.getElementById("togglePassword"),
  changePasswordModal: document.getElementById("changePasswordModal"),
  currentPassword: document.getElementById("currentPassword"),
  newPassword: document.getElementById("newPassword"),
  confirmPassword: document.getElementById("confirmPassword"),
  savePassword: document.getElementById("savePassword"),
  cancelPasswordChange: document.getElementById("cancelPasswordChange"),
  passwordChangeError: document.getElementById("passwordChangeError"),
  financialAnalysisModal: document.getElementById("financialAnalysisModal"),
  closeAnalysisBtn: document.getElementById("closeAnalysisBtn"),

  // Financial Analysis Elements
  totalIncome: document.getElementById("totalIncome"),
  totalPaid: document.getElementById("totalPaid"),
  totalRemaining: document.getElementById("totalRemaining"),
  totalCustomers: document.getElementById("totalCustomers"),

  // Other Elements
  scrollToTopBtn: document.getElementById("scrollToTopBtn"),
  changePasswordBtn: document.getElementById("changePasswordBtn"),
  mainContent: document.querySelector(".crud"),
};

// App State
let state = {
  dataPro: localStorage.product ? JSON.parse(localStorage.product) : [],
  mode: "create",
  tmp: null,
  searchMode: "title",
  currentPassword: localStorage.getItem("appPassword") || "1234",
  isAuthenticated: false,
};

// Initialize the application
function init() {
  checkAuth();
  setupAuthEventListeners();
  setupEventListeners();
  showData();
}

// Authentication Functions
function checkAuth() {
  const sessionActive = sessionStorage.getItem("isAuthenticated");

  if (!sessionActive) {
    elements.mainContent.style.display = "none";
    elements.passwordModal.style.display = "flex";
    elements.passwordInput.focus();
  } else {
    elements.mainContent.style.display = "block";
    elements.passwordModal.style.display = "none";
    sessionStorage.setItem("isAuthenticated", "true");
    state.isAuthenticated = true;
  }
}

function setupAuthEventListeners() {
  elements.submitPassword.addEventListener("click", handlePasswordSubmit);
  elements.passwordInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handlePasswordSubmit();
  });

  elements.togglePassword.addEventListener("click", function () {
    const type =
      elements.passwordInput.getAttribute("type") === "password"
        ? "text"
        : "password";
    elements.passwordInput.setAttribute("type", type);
    this.textContent = type === "password" ? "👁" : "👁‍🗨";
  });

  // Change Password
  elements.changePasswordBtn.addEventListener("click", () => {
    elements.changePasswordModal.style.display = "flex";
    elements.currentPassword.focus();
  });

  elements.cancelPasswordChange.addEventListener("click", () => {
    elements.changePasswordModal.style.display = "none";
    clearPasswordFields();
  });

  elements.savePassword.addEventListener("click", handlePasswordChange);

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      this.textContent = type === "password" ? "👁" : "👁‍🗨";
    });
  });

  [
    elements.currentPassword,
    elements.newPassword,
    elements.confirmPassword,
  ].forEach((input) => {
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") handlePasswordChange();
    });
  });
}

function handlePasswordSubmit() {
  if (elements.passwordInput.value === state.currentPassword) {
    sessionStorage.setItem("isAuthenticated", "true");
    state.isAuthenticated = true;
    elements.passwordModal.style.display = "none";
    elements.mainContent.style.display = "block";
    elements.passwordError.style.display = "none";
    elements.passwordInput.value = "";
  } else {
    elements.passwordError.style.display = "block";
    elements.passwordInput.value = "";
    elements.passwordInput.focus();
  }
}

function handlePasswordChange() {
  const currentPass = elements.currentPassword.value;
  const newPass = elements.newPassword.value;
  const confirmPass = elements.confirmPassword.value;

  if (currentPass !== state.currentPassword) {
    showPasswordError("كلمة المرور الحالية غير صحيحة");
    return;
  }

  if (newPass.length < 4) {
    showPasswordError("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
    return;
  }

  if (newPass !== confirmPass) {
    showPasswordError("كلمة المرور الجديدة غير متطابقة");
    return;
  }

  state.currentPassword = newPass;
  localStorage.setItem("appPassword", newPass);
  elements.changePasswordModal.style.display = "none";
  clearPasswordFields();
  alert("تم تغيير كلمة المرور بنجاح");
}

function clearPasswordFields() {
  elements.currentPassword.value = "";
  elements.newPassword.value = "";
  elements.confirmPassword.value = "";
  elements.passwordChangeError.style.display = "none";
}

function showPasswordError(message) {
  elements.passwordChangeError.textContent = message;
  elements.passwordChangeError.style.display = "block";
}

// Main Application Functions
function setupEventListeners() {
  // Form Submission
  elements.submit.addEventListener("click", handleSubmit);

  // Image Handling
  elements.imageInput.addEventListener("change", handleImageChange);

  // Table Actions
  elements.convertBtn.addEventListener("click", convertTableToImage);
  elements.exportExcel.addEventListener("click", exportToExcel);
  elements.analyzeBtn.addEventListener("click", showFinancialAnalysis);
  elements.closeAnalysisBtn.addEventListener("click", () => {
    elements.financialAnalysisModal.style.display = "none";
  });

  // Search Functionality
  elements.search.addEventListener("keyup", (e) => searchData(e.target.value));
  document
    .getElementById("searchTitle")
    .addEventListener("click", () => setSearchMode("title"));
  document
    .getElementById("searchID")
    .addEventListener("click", () => setSearchMode("id"));

  // Scroll to Top
  elements.scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Time Period Selector
  document.querySelectorAll(".time-period-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".time-period-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      updateFinancialAnalysis(this.getAttribute("data-period"));
    });
  });

  // Window Events
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("beforeunload", () => {
    if (state.isAuthenticated) {
      sessionStorage.setItem("isAuthenticated", "true");
    }
  });
}

function handleScroll() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    elements.scrollToTopBtn.style.display = "block";
  } else {
    elements.scrollToTopBtn.style.display = "none";
  }
}

// Financial Calculations
function calculateTotal() {
  if (elements.price.value !== "") {
    const price = parseFloat(elements.price.value) || 0;
    const taxes = parseFloat(elements.taxes.value) || 0;
    const ads = parseFloat(elements.ads.value) || 0;

    const result = price + taxes;
    elements.total.innerHTML = result;
    elements.total.style.background = "#3838b6";

    const remainingAmount = result - ads;
    elements.rest.value = remainingAmount > 0 ? remainingAmount : 0;
  } else {
    elements.total.innerHTML = "";
    elements.total.style.background = "#6868cb";
  }
}

function handleSubmit() {
  const newPro = {
    date: getCurrentDate(),
    title: elements.title.value.toLowerCase(),
    price: elements.price.value,
    taxes: elements.taxes.value,
    ads: elements.ads.value,
    rest: elements.rest.value,
    total: elements.total.innerHTML,
    category: elements.category.value.toLowerCase(),
    lensCategory: elements.lensCategory.value.toLowerCase(),
    image: elements.selectedImage.src,
  };

  if (newPro.title.trim() === "") {
    alert("من فضلك ادخل اسم العميل");
    return;
  }

  if (state.mode === "create") {
    state.dataPro.push(newPro);
  } else {
    state.dataPro[state.tmp] = newPro;
    state.mode = "create";
    elements.submit.innerHTML = "Create";
  }

  localStorage.setItem("product", JSON.stringify(state.dataPro));
  clearData();
  showData();
}

function clearData() {
  elements.title.value = "";
  elements.price.value = "";
  elements.taxes.value = "";
  elements.ads.value = "";
  elements.rest.value = "0";
  elements.total.innerHTML = "";
  elements.category.value = "";
  elements.lensCategory.value = "";
  elements.imageInput.value = "";
  elements.selectedImage.src = "/img/avatar.png";

  // Clear prescription inputs
  const prescriptionInputs = document.querySelectorAll(
    ".eyeglass-prescription input"
  );
  prescriptionInputs.forEach((input) => (input.value = ""));
}

function showData() {
  calculateTotal();

  let table = "";
  state.dataPro.forEach((item, i) => {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.date}</td>
        <td>${item.title}</td>
        <td>${item.price}</td>
        <td>${item.taxes}</td>
        <td class="paid">${item.ads}</td>
        <td class="remaining">${item.rest}</td>
        <td>${item.total}</td>
        <td>${item.category}</td>
        <td>${item.lensCategory}</td>
        <td><img src="${item.image}" onclick="openImage('${
      item.image
    }')" class="customer-image" /></td>
        <td><button onclick="updateData(${i})" class="update-btn">تعديل</button></td>
        <td><button onclick="deleteData(${i})" class="delete-btn">حذف</button></td>
      </tr>
    `;
  });

  elements.tbody.innerHTML = table;

  if (state.dataPro.length > 0) {
    elements.deleteAll.innerHTML = `<button onclick="deleteAll()">حذف الكل (${state.dataPro.length})</button>`;
  } else {
    elements.deleteAll.innerHTML = "";
  }
}

function deleteData(i) {
  if (confirm("هل انت متاكد من انك تريد حذف هذا العنصر؟")) {
    state.dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(state.dataPro);
    showData();
  }
}

function deleteAll() {
  if (confirm("هل انت متاكد من انك تريد حذف جميع العناصر؟")) {
    localStorage.removeItem("product");
    state.dataPro = [];
    showData();
  }
}

function updateData(i) {
  const item = state.dataPro[i];

  elements.title.value = item.title;
  elements.price.value = item.price;
  elements.taxes.value = item.taxes;
  elements.ads.value = item.ads;
  elements.rest.value = item.rest;
  elements.category.value = item.category;
  elements.lensCategory.value = item.lensCategory;
  elements.selectedImage.src = item.image;

  calculateTotal();
  elements.submit.innerHTML = "Update";
  state.mode = "Update";
  state.tmp = i;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setSearchMode(mode) {
  state.searchMode = mode;
  elements.search.placeholder = `Search By ${mode === "title" ? "Name" : "ID"}`;
  elements.search.focus();
  elements.search.value = "";
  showData();
}

function searchData(value) {
  let table = "";

  state.dataPro.forEach((item, i) => {
    const id = i + 1;

    if (
      (state.searchMode === "title" &&
        item.title.includes(value.toLowerCase())) ||
      (state.searchMode === "id" && id.toString() === value)
    ) {
      table += `
        <tr>
          <td>${id}</td>
          <td>${item.date}</td>
          <td>${item.title}</td>
          <td>${item.price}</td>
          <td>${item.taxes}</td>
          <td class="paid">${item.ads}</td>
          <td class="remaining">${item.rest}</td>
          <td>${item.total}</td>
          <td>${item.category}</td>
          <td>${item.lensCategory}</td>
          <td><img src="${item.image}" onclick="openImage('${item.image}')" class="customer-image" /></td>
          <td><button onclick="updateData(${i})" class="update-btn">تعديل</button></td>
          <td><button onclick="deleteData(${i})" class="delete-btn">حذف</button></td>
        </tr>
      `;
    }
  });

  elements.tbody.innerHTML = table;
}

// Image Handling
function handleImageChange() {
  const file = elements.imageInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      elements.selectedImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
  } else {
    elements.selectedImage.src = "/img/avatar.png";
  }
}

function openImage(imageUrl) {
  const imageWindow = window.open("", "_blank", "width=600,height=400");
  imageWindow.document.write(`
    <img src="${imageUrl}" style="
      max-width: 100%;
      max-height: 100%;
      display: block;
      margin: 0 auto;
      background-color: black;
    ">
  `);
}

// Table Conversion
function convertTableToImage() {
  const table = document.querySelector(".eyeglass-prescription");

  html2canvas(table).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "eyeglass_prescription.png";
    link.click();

    // Clear inputs after screenshot
    const inputs = table.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
  });
}

// Export to Excel
function exportToExcel() {
  if (state.dataPro.length === 0) {
    alert("لا توجد بيانات لتصديرها");
    return;
  }

  let csv =
    "ID,Date,Name,Frame Price,Lens Price,Paid,Remaining,Total,Frame Type,Lens Type\n";

  state.dataPro.forEach((item, i) => {
    csv += `${i + 1},${item.date},${item.title},${item.price},${item.taxes},${
      item.ads
    },${item.rest},${item.total},${item.category},${item.lensCategory}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  link.href = url;
  link.download = `NEWLOOK_Customers_${dateStr}.csv`;
  link.click();

  // Show success feedback
  elements.exportExcel.textContent = "تم التصدير بنجاح!";
  setTimeout(() => {
    elements.exportExcel.textContent = "Export to Excel";
  }, 2000);
}

// Financial Analysis
function showFinancialAnalysis() {
  elements.financialAnalysisModal.style.display = "flex";
  updateFinancialAnalysis("week"); // Default to week view
}

function updateFinancialAnalysis(period) {
  const now = new Date();
  let startDate;

  switch (period) {
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "month":
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "year":
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0); // All time
  }

  const filteredData = state.dataPro.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate;
  });

  const totalIncome = filteredData.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );
  const totalPaid = filteredData.reduce(
    (sum, item) => sum + (parseFloat(item.ads) || 0),
    0
  );
  const totalRemaining = filteredData.reduce(
    (sum, item) => sum + (parseFloat(item.rest) || 0),
    0
  );

  elements.totalIncome.textContent = `${totalIncome.toFixed(2)} EGP`;
  elements.totalPaid.textContent = `${totalPaid.toFixed(2)} EGP`;
  elements.totalRemaining.textContent = `${totalRemaining.toFixed(2)} EGP`;
  elements.totalCustomers.textContent = filteredData.length;
}

// Utility Functions
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Initialize the application
init();

// scroll bottom
document.addEventListener("DOMContentLoaded", function () {
  const endRef = document.getElementById("endRef");
  if (endRef) {
    endRef.scrollIntoView({ behavior: "smooth" });
  }
});

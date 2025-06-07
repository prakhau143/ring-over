alert('app.js loaded! If you see this, JS is running.');
console.log('app.js (simplified) is loaded and running!');
// --- Original app.js content below this line is effectively commented out for this test ---
console.log('app.js: Script loaded');

let currentPage = 1; // Initialize currentPage globally
let itemsPerPage = 10; // Default items per page
let tableBody = null;
let selectAllCheckbox = null;
let filteredProductList = []; // Holds the currently filtered list of products, initialized in renderProducts

// 20 Figma-style products with icons
const mockProducts = [
  { id: 'P001', name: 'Wireless Headphones', category: 'Audio', price: 59.99, stock: 120, status: 'Active', dateAdded: '2024-01-01', icon: '🎧' },
  { id: 'P002', name: 'Smartphone', category: 'Mobile', price: 699.99, stock: 80, status: 'Active', dateAdded: '2024-01-05', icon: '📱' },
  { id: 'P003', name: 'Fitness Tracker', category: 'Wearables', price: 129.99, stock: 55, status: 'Inactive', dateAdded: '2024-01-10', icon: '🗂️' }, // Changed to modern tablet icon
  { id: 'P004', name: 'Bluetooth Speaker', category: 'Audio', price: 39.99, stock: 200, status: 'Active', dateAdded: '2024-01-12', icon: '🔊' },
  { id: 'P005', name: 'Laptop', category: 'Computers', price: 1199.99, stock: 35, status: 'Active', dateAdded: '2024-01-15', icon: '💻' },
  { id: 'P006', name: 'Tablet', category: 'Mobile', price: 499.99, stock: 60, status: 'Active', dateAdded: '2024-01-18', icon: '🗂️' },
  { id: 'P007', name: 'DSLR Camera', category: 'Cameras', price: 899.99, stock: 25, status: 'Inactive', dateAdded: '2024-01-20', icon: '📷' },
  { id: 'P008', name: 'Smartwatch', category: 'Wearables', price: 199.99, stock: 70, status: 'Active', dateAdded: '2024-01-22', icon: '⌚' },
  { id: 'P009', name: 'Gaming Console', category: 'Gaming', price: 399.99, stock: 40, status: 'Active', dateAdded: '2024-01-25', icon: '🎮' },
  { id: 'P010', name: 'Wireless Mouse', category: 'Accessories', price: 24.99, stock: 300, status: 'Active', dateAdded: '2024-01-28', icon: '🖱️' },
  { id: 'P011', name: 'Mechanical Keyboard', category: 'Accessories', price: 89.99, stock: 150, status: 'Active', dateAdded: '2024-02-01', icon: '⌨️' },
  { id: 'P012', name: '4K Monitor', category: 'Computers', price: 349.99, stock: 50, status: 'Active', dateAdded: '2024-02-04', icon: '🖥️' },
  { id: 'P013', name: 'VR Headset', category: 'Gaming', price: 299.99, stock: 20, status: 'Inactive', dateAdded: '2024-02-08', icon: '🕶️' },
  { id: 'P014', name: 'External SSD', category: 'Storage', price: 139.99, stock: 90, status: 'Active', dateAdded: '2024-02-11', icon: '💾' },
  { id: 'P015', name: 'Action Camera', category: 'Cameras', price: 249.99, stock: 45, status: 'Active', dateAdded: '2024-02-15', icon: '📸' },
  { id: 'P016', name: 'Smart Light Bulb', category: 'Home', price: 19.99, stock: 400, status: 'Active', dateAdded: '2024-02-18', icon: '💡' },
  { id: 'P017', name: 'Robot Vacuum', category: 'Home', price: 299.99, stock: 30, status: 'Active', dateAdded: '2024-02-21', icon: '🤖' },
  { id: 'P018', name: 'Portable Charger', category: 'Accessories', price: 34.99, stock: 180, status: 'Active', dateAdded: '2024-02-24', icon: '🔋' },
  { id: 'P019', name: 'Noise Cancelling Earbuds', category: 'Audio', price: 149.99, stock: 110, status: 'Active', dateAdded: '2024-02-27', icon: '🎧' },
  { id: 'P020', name: 'Smart Thermostat', category: 'Home', price: 199.99, stock: 22, status: 'Inactive', dateAdded: '2024-03-01', icon: '🌡️' }
];

// SPA Router
const routes = {
    '#dashboard': renderDashboard,
    '#products': renderProducts,
    '': renderDashboard // default
};

function router() {
    console.log("app.js: router called. Hash:", window.location.hash);
    const hash = window.location.hash || '#dashboard';
    const pageFunction = routes[hash] || routes['#dashboard'];
    setActiveNav(hash);
    if (typeof pageFunction === 'function') {
        pageFunction();
    } else {
        console.error("app.js: No route found or pageFunction is not a function for hash:", window.location.hash);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `<p style='color:red;'>Error: Page not found or invalid route configuration.</p>`;
        }
    }
}

window.onerror = function(msg, src, lineno, colno, error) {
    console.log("app.js: window.onerror triggered.");
    const main = document.getElementById('main-content');
    const errorMsg = `Global JS Error: ${msg}\nAt ${src}:${lineno}:${colno}`;
    if (main) {
        main.innerHTML = `<pre style='color:red;white-space:pre-wrap;'>${errorMsg}</pre>`;
    } else {
        alert(errorMsg);
    }
    console.error("Global error details:", msg, src, lineno, colno, error);
    return true; // Prevents default browser error handling
};

function setActiveNav(hash) {
    console.log("app.js: setActiveNav called with hash:", hash);
    document.querySelectorAll('.header-nav a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === hash);
    });
}

// Products Page (Minimal Fallback)
function renderProducts() {
    console.log('app.js: renderProducts called. Initial currentPage:', currentPage);
    console.log("app.js: renderProducts (full) called");
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        // Figma-pixel-perfect Products Page Structure
        mainContent.innerHTML = `
        <div class="products-page-figma">
          <div class="products-header-row">
            <div class="products-title">Products</div>
            <div class="products-actions">
              <div class="products-search-container">
                <input type="text" id="product-search-input" class="products-search-input" placeholder="Search products...">
                <span class="products-search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
              <button id="add-product-button" class="products-fg-card-add">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          <div class="products-table-card">
            <table class="products-fg-table">
              <thead>
                <tr>
                  <th class="products-table-checkbox-cell"><input type="checkbox" id="select-all-products" class="products-table-checkbox"></th>
                  <th>PRODUCT NAME</th>
                  <th>ID</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody id="products-table-body">
                <!-- Product rows will be injected here -->
              </tbody>
            </table>
          </div>

          <div class="products-pagination-container">
            <div id="pagination-info" class="products-pagination-summary"></div>
            <div id="pagination-controls-nav" class="products-pagination-controls"></div>
            <div class="products-items-per-page">
              <label for="items-per-page">Items per page:</label>
              <select id="items-per-page" class="products-items-dropdown">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </div>
        <div id="product-modal" class="products-modal hidden"></div>
      `;
        tableBody = document.getElementById('products-table-body');
        selectAllCheckbox = document.getElementById('select-all-products');
        console.log('renderProducts: tableBody assigned:', tableBody);
        console.log('renderProducts: selectAllCheckbox assigned:', selectAllCheckbox);
        // Initialize/reset filtered list with all products when products page is rendered
  filteredProductList = [...mockProducts];
  console.log('renderProducts: Initialized filteredProductList with', filteredProductList.length, 'items.');

  displayPaginatedProducts(); // Populate the table and pagination controls

  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
      searchInput.addEventListener('input', (e) => {
          const searchTerm = e.target.value;
          console.log('Search input event. Term:', searchTerm);
          filterProducts(searchTerm); // This updates filteredProductList
          currentPage = 1; // Reset to first page after search
          displayPaginatedProducts(); // Re-render table and pagination
      });
  }

  const addProductButton = document.getElementById('add-product-button');
  if (addProductButton) {
      addProductButton.addEventListener('click', () => {
          console.log('Add Product button clicked');
          openProductModal(); // Open modal for adding a new product
      });
  }

  const itemsPerPageSelect = document.getElementById('items-per-page');
  if (itemsPerPageSelect) {
      itemsPerPageSelect.value = itemsPerPage.toString(); // Set initial value from global itemsPerPage
      itemsPerPageSelect.addEventListener('change', (e) => {
          itemsPerPage = parseInt(e.target.value, 10);
          console.log('Items per page changed to:', itemsPerPage);
          currentPage = 1; // Reset to first page
          displayPaginatedProducts(); // Re-render table and pagination
      });
  }
        // TODO: Re-attach or verify event listeners for product page elements if they are not globally robust

        // Ensure event listeners that depend on tableBody and selectAllCheckbox are set up here or called from here
        // if they are not already robustly handled.
        // For example, the 'select all' checkbox listener:
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                if (tableBody) {
                    const productCheckboxes = tableBody.querySelectorAll('.product-checkbox');
                    productCheckboxes.forEach(checkbox => {
                        checkbox.checked = isChecked;
                    });
                }
                updateSelectAllCheckboxState(); // Call after toggling all
            });
        }

        // And the tableBody change listener for individual checkboxes:
        if (tableBody) {
            tableBody.addEventListener('change', (e) => {
                if (e.target.classList.contains('product-checkbox')) {
                    updateSelectAllCheckboxState();
                }
            });
        }

        console.log("Full renderProducts executed and replaced content, called displayPaginatedProducts.");
        console.log("Minimal renderProducts executed and replaced content.");
    } else {
        console.error("main-content element not found for renderProducts.");
        alert("Error: Main content area not found. Products page cannot be displayed.");
    }
} // End of simplified renderProducts_DEACTIVATED definition.

window.addEventListener('DOMContentLoaded', () => {
    console.log('app.js: DOMContentLoaded event fired');
    router();
});
window.addEventListener('hashchange', router);

// Dashboard Page
function renderDashboard() {
    console.log("app.js: renderDashboard called");
    document.getElementById('main-content').innerHTML = `
      <div class="dashboard-wrapper">
        <div class="dashboard-header-row">
          <div class="dashboard-title">Dashboard</div>
          <div class="dashboard-actions">
            <select id="date-filter" class="dashboard-date-filter">
              <option value="7">Last 7 days</option>
              <option value="30" selected>Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button class="dashboard-report-btn">View Report</button>
          </div>
        </div>
        <div class="dashboard-stats-grid">
          <div class="stat-card stat-card-sales">
            <div class="stat-card-label">Total Sales</div>
            <div class="stat-card-value" id="stat-sales-value">--</div>
            <div class="stat-card-subtext" id="stat-sales-change">--</div>
          </div>
          <div class="stat-card stat-card-orders">
            <div class="stat-card-label">Orders</div>
            <div class="stat-card-value" id="stat-orders-value">--</div>
            <div class="stat-card-subtext" id="stat-orders-change">--</div>
          </div>
          <div class="stat-card stat-card-profit">
            <div class="stat-card-label">Total Profit</div>
            <div class="stat-card-value" id="stat-profit-value">--</div>
            <div class="stat-card-subtext" id="stat-profit-change">--</div>
          </div>
          <div class="stat-card stat-card-sessions">
            <div class="stat-card-label">Sessions</div>
            <div class="stat-card-value" id="stat-sessions-value">--</div>
            <div class="stat-card-subtext" id="stat-sessions-change">--</div>
          </div>
        </div>
        <div class="dashboard-graphs-row">
          <div class="dashboard-graph-card">
            <div class="dashboard-graph-header">
              <span>Sales Overview</span>
              <select id="sales-period-select" class="graph-filter-select">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly" selected>Monthly</option>
          <div class="dashboard-graph-card" id="sales-overview-card">
            <div class="dashboard-graph-header">
              <span>Sales Overview</span>
              <select class="graph-filter-select" id="sales-overview-period">
                <option value="monthly" selected>Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div class="dashboard-graph-content" id="sales-overview-graph"></div>
          </div>
          <div class="dashboard-graph-card" id="profit-overview-card">
            <div class="dashboard-graph-header">
              <span>Total Profit</span>
            </div>
            <div class="dashboard-graph-content" id="total-profit-graph"></div>
          </div>
          <div class="dashboard-graph-card" id="sessions-overview-card">
            <div class="dashboard-graph-header">
              <span>Sessions</span>
            </div>
            <div class="dashboard-graph-content" id="sessions-overview-graph"></div>
          </div>
            <div class="dashboard-graph-header">
              <span>Total Sessions</span>
            </div>
            <div class="dashboard-graph-content" id="total-sessions-graph"></div>
          </div>
        </div>
      </div>
    `;
    setupDashboard();
}

// Mock data generation functions (can be more sophisticated)
function generateRandomValue(base, period) {
    // Generate a random value scaled by period (7, 30, 90 days)
    let multiplier = 1;
    if (period == 7) multiplier = 0.25 + Math.random() * 0.2; // 7 days: 25-45% of base
    else if (period == 30) multiplier = 1 + Math.random() * 0.2; // 30 days: 100-120% of base
    else if (period == 90) multiplier = 3 + Math.random() * 0.3; // 90 days: 300-330% of base
    return Math.round(base * multiplier);
}

function generateRandomPercentage() {
    console.log("app.js: generateRandomPercentage called");
    const value = (Math.random() * 15).toFixed(1);
    return Math.random() < 0.5 ? `-${value}%` : `+${value}%`;
}

function updateStatCards(period = 'monthly') {
    // Figma-inspired values for each period
    const statData = {
        daily:   { sales: 520,  orders: 18,  profit: 200,  sessions: 160 },
        weekly:  { sales: 3800,  orders: 90,  profit: 1700,  sessions: 1100 },
        monthly: { sales: 15600, orders: 370, profit: 6900, sessions: 4700 },
        '7':     { sales: 3800,  orders: 90,  profit: 1700,  sessions: 1100 },
        '30':    { sales: 15600, orders: 370, profit: 6900, sessions: 4700 },
        '1':     { sales: 520,  orders: 18,  profit: 200,  sessions: 160 },
        '90':    { sales: 44500, orders: 1090, profit: 20200, sessions: 13600 }
    };
    let key = period;
    if (period === '7') key = 'weekly';
    if (period === '30') key = 'monthly';
    if (period === '1' || period === 'daily') key = 'daily';
    const stats = statData[key] || statData['monthly'];

    document.getElementById('stat-sales-value').textContent = `$${stats.sales.toLocaleString()}`;
    document.getElementById('stat-orders-value').textContent = stats.orders.toLocaleString();
    document.getElementById('stat-profit-value').textContent = `$${stats.profit.toLocaleString()}`;
    document.getElementById('stat-sessions-value').textContent = stats.sessions.toLocaleString();

    // Demo: Use random percentage change with up/down/neutral arrow and color
    function statChangeHTML(val) {
        const percent = Math.abs(val).toFixed(1);
        if (val > 0) {
            return `<span class="stat-arrow stat-up">▲</span> ${percent}% from last period`;
        } else if (val < 0) {
            return `<span class="stat-arrow stat-down">▼</span> ${percent}% from last period`;
        } else {
            return `<span class="stat-arrow stat-stable">●</span> 0% from last period`;
        }
    }
    function statClass(val) {
        if (val > 0) return 'stat-sub stat-up';
        if (val < 0) return 'stat-sub stat-down';
        return 'stat-sub stat-stable';
    }
    // Generate random demo changes
    const salesChange = (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1));
    const ordersChange = (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1));
    const profitChange = (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1));
    const sessionsChange = (Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1));
    document.getElementById('stat-sales-change').innerHTML = statChangeHTML(salesChange);
    document.getElementById('stat-sales-change').className = statClass(salesChange);
    document.getElementById('stat-orders-change').innerHTML = statChangeHTML(ordersChange);
    document.getElementById('stat-orders-change').className = statClass(ordersChange);
    document.getElementById('stat-profit-change').innerHTML = statChangeHTML(profitChange);
    document.getElementById('stat-profit-change').className = statClass(profitChange);
    document.getElementById('stat-sessions-change').innerHTML = statChangeHTML(sessionsChange);
    document.getElementById('stat-sessions-change').className = statClass(sessionsChange);

    // Also update graphs for the selected period
    updateSalesOverviewGraph(period);
    updateProfitGraph(period);
    updateSessionsGraph(period);
}

// Graph data for each period (Figma-inspired)
const salesOverviewData = {
    weekly: { data: [700, 580, 610, 540, 820, 650, 400], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    daily:  { data: [30, 45, 60, 55, 40, 50, 65, 70, 80, 90, 100, 110, 120, 130, 125, 115, 105, 95, 85, 75, 65, 55, 45, 35], labels: Array.from({length:24},(_,i)=>`${i}h`) },
    monthly: { data: [800, 900, 950, 1100, 1200, 1300, 1350, 1200, 1100, 900, 950, 1000, 1100, 1200, 1300, 1200, 1100, 900, 950, 1000, 1100, 1200, 1300, 1200, 1100, 900, 950, 1000, 1100, 1200], labels: Array.from({length:30},(_,i)=>`Day ${i+1}`) },

    90:   { data: [4200, 4300, 4100, 4500, 4800, 4700, 4900, 5000, 5200, 5300, 5400, 5500], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] }
};
const profitData = {
    7:    { data: [200, 320, 170, 250, 310, 220, 230], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    30:   { data: [300, 400, 350, 420, 500, 450, 470, 400, 420, 410, 430, 440, 470, 480, 490, 420, 430, 410, 400, 420, 410, 430, 440, 470, 480, 490, 420, 430, 410, 440], labels: Array.from({length:30},(_,i)=>`Day ${i+1}`) },
    90:   { data: [1700, 1800, 1600, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] }
};
const sessionsData = {
    7:    { data: [120, 110, 140, 130, 150, 160, 170], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    30:   { data: [150, 170, 160, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440], labels: Array.from({length:30},(_,i)=>`Day ${i+1}`) },
    90:   { data: [1100, 1200, 1000, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] }
};

function updateSalesOverviewGraph(period = 'monthly') {
    let key = period;
    if (period === '7') key = 'weekly';
    if (period === '30') key = 'monthly';
    if (period === '1' || period === 'daily') key = 'daily';
    const { data, labels } = salesOverviewData[key] || salesOverviewData['monthly'];
    const container = document.getElementById('sales-overview-graph');
    if (container) {
        let xAxisLabel = 'Day';
        if (key === 'weekly') xAxisLabel = 'Day';
        else if (key === 'daily') xAxisLabel = 'Hour';
        else if (key === 'monthly') xAxisLabel = 'Day';
        container.innerHTML = renderGraph(data, labels, {
            yAxisLabel: 'Sales',
            xAxisLabel
        });
    }
}
function updateProfitGraph(period = '30') {
    period = parseInt(period, 10);
    const { data, labels } = profitData[period] || profitData[30];
    const container = document.getElementById('total-profit-graph');
    if (container) {
        container.innerHTML = renderGraph(data, labels, {
            yAxisLabel: 'Profit ($)',
            xAxisLabel: period === 7 ? 'Day' : (period === 30 ? 'Day' : 'Month')
        });
    }
}
function updateSessionsGraph(period = '30') {
    period = parseInt(period, 10);
    const { data, labels } = sessionsData[period] || sessionsData[30];
    const container = document.getElementById('total-sessions-graph');
    if (container) {
        container.innerHTML = renderGraph(data, labels, {
            yAxisLabel: 'Sessions',
            xAxisLabel: period === 7 ? 'Day' : (period === 30 ? 'Day' : 'Month')
        });
    }
}

function setupDashboard() {
    console.log("app.js: setupDashboard called");
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Define monthLabels here

    // --- Date Filter for Stat Cards ---
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter) {
        updateStatCards(dateFilter.value); // Initial population based on current filter
        dateFilter.addEventListener('change', (event) => {
            updateStatCards(event.target.value);
        });
    } else {
        updateStatCards(); // Fallback if filter not found, use default period
    }

    // --- Sales Overview Graph (Initial Render) ---
    updateSalesOverviewGraph('monthly'); // Initial render with monthly data

    // Add event listener for Sales Overview time filter
    const salesTimeFilter = document.querySelector('#sales-overview-card .graph-filter-select');
    if (salesTimeFilter) {
        salesTimeFilter.addEventListener('change', (event) => {
            updateSalesOverviewGraph(event.target.value);
        });
    }

    // --- Total Profit Graph ---
    const monthlyProfitData = [3000, 3500, 3200, 4000, 4800, 4500, 5200, 4900, 5500, 6000, 6500, 6200];
    const profitGraphContainer = document.getElementById('total-profit-graph');
    if (profitGraphContainer) {
        profitGraphContainer.innerHTML = renderGraph(monthlyProfitData, monthLabels, {
            yAxisLabel: 'Profit ($)',
            xAxisLabel: 'Month'
            // Potentially different styling options if needed, e.g., line color
        });
    }

    // --- Total Sessions Graph ---
    const monthlySessionsData = [1200, 1300, 1100, 1400, 1600, 1500, 1700, 1650, 1800, 1900, 2100, 2000];
    const sessionsGraphContainer = document.getElementById('total-sessions-graph');
    if (sessionsGraphContainer) {
        sessionsGraphContainer.innerHTML = renderGraph(monthlySessionsData, monthLabels, {
            yAxisLabel: 'Sessions', 
            xAxisLabel: 'Month'
            // Potentially different styling options
        });
    }

    // The main dateFilter listener is now set up earlier

    // Sidebar sections (Top Products, Recent Activity) removed.

    // Redundant dateFilter listener removed. The one at the start of setupDashboard is used.
    const reportButton = document.querySelector('.dashboard-report-btn');
    if(reportButton) {
        reportButton.addEventListener('click', () => {
            console.log('View Report button clicked');
            // Add logic for report generation/navigation
        });
    }

    // Interactive hover for stat cards (already handled by new structure if .stat-card is targeted by CSS)
}

function renderGraph(data, labels, options = {}) {
    console.log("app.js: renderGraph called with data:", data, "labels:", labels, "and options:", options);
    const { yAxisLabel = 'Value', xAxisLabel = 'Category' } = options;
    const svgWidth = 550; // Adjusted to fit typical card width better
    const svgHeight = 220; // Adjusted for better aspect ratio
    const margin = { top: 20, right: 20, bottom: 40, left: 50 }; // Increased left margin for Y-axis labels
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const maxValue = Math.max(...data, 0);
    const minValue = 0; // Assuming sales don't go negative

    // Create X and Y scales
    const xScale = (index) => margin.left + (index / (labels.length - 1)) * chartWidth;
    const yScale = (value) => margin.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    // Generate path data for the line
    const linePath = data.map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    // Generate circles for data points
    const circlesHtml = data.map((value, index) => {
        const x = xScale(index);
        const y = yScale(value);
        return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" class="graph-point" data-value="${value}" data-label="${labels[index]}"></circle>`;
    }).join('');

    // Generate X-axis labels
    const xAxisLabelsHtml = labels.map((label, index) => {
        const x = xScale(index);
        return `<text x="${x.toFixed(2)}" y="${(margin.top + chartHeight + 20).toFixed(2)}" class="graph-x-axis-label">${label}</text>`;
    }).join('');

    // Generate Y-axis labels and grid lines (simplified)
    const yAxisTicks = 5;
    let yAxisHtml = '';
    for (let i = 0; i <= yAxisTicks; i++) {
        const value = minValue + (maxValue - minValue) * (i / yAxisTicks);
        const y = yScale(value);
        yAxisHtml += `<line x1="${margin.left}" y1="${y.toFixed(2)}" x2="${(margin.left + chartWidth).toFixed(2)}" y2="${y.toFixed(2)}" class="graph-grid-line"></line>`;
        yAxisHtml += `<text x="${(margin.left - 10).toFixed(2)}" y="${y.toFixed(2)}" dy=".3em" class="graph-y-axis-label">${Math.round(value / 1000)}k</text>`; // Display as '15k'
    }

    // Axis titles
    const yAxisTitleHtml = `<text transform="rotate(-90)" x="-${(margin.top + chartHeight / 2).toFixed(2)}" y="${(margin.left - 35).toFixed(2)}" class="graph-axis-title">${yAxisLabel}</text>`;
    const xAxisTitleHtml = `<text x="${(margin.left + chartWidth / 2).toFixed(2)}" y="${(svgHeight - 5).toFixed(2)}" class="graph-axis-title">${xAxisLabel}</text>`;


    return `
        <svg width="${svgWidth}" height="${svgHeight}" class="line-graph-svg">
            <g class="graph-grid">
                ${yAxisHtml}
            </g>
            <g class="graph-axes">
                ${xAxisLabelsHtml}
                ${yAxisTitleHtml}
                ${xAxisTitleHtml}
            </g>
            <path d="${linePath}" class="graph-line"></path>
            <g class="graph-points">
                ${circlesHtml}
            </g>
        </svg>
    `;
}

 

function filterProducts(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    console.log('filterProducts: Filtering with term -', lowerCaseSearchTerm);
    if (!lowerCaseSearchTerm) {
        filteredProductList = [...mockProducts];
    } else {
        filteredProductList = mockProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.id.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }
    console.log('filterProducts: Filtered list count -', filteredProductList.length);
}

function openProductModal(productId = null) {
    console.log('openProductModal called for productId:', productId);
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    // Figma-inspired Add New Project (Product) Modal
    if (productId) {
        // Edit logic (not implemented here)
        const product = mockProducts.find(p => p.id === productId);
        modal.innerHTML = `<div class="products-modal-content">
            <span class="close-modal-btn" onclick="closeProductModal()">&times;</span>
            <h2 class="products-fg-modal-title">Edit Product: ${product ? product.name : 'N/A'}</h2>
            <div class="products-fg-modal-fields">
                <p>Edit logic not implemented.</p>
            </div>
            <div class="form-actions">
                <button class="btn-secondary" onclick="closeProductModal()">Cancel</button>
            </div>
        </div>`;
        modal.classList.remove('hidden');
        return;
    }

    // Add New Product (Figma Add Project) Modal
    modal.innerHTML = `<div class="products-modal-content">
        <span class="close-modal-btn" onclick="closeProductModal()">&times;</span>
        <h2 class="products-fg-modal-title">Add New Project</h2>
        <form id="add-project-form" autocomplete="off">
            <div class="products-fg-modal-fields">
                <div class="form-field">
                    <label for="project-name">Project Name</label>
                    <input type="text" id="project-name" class="products-fg-modal-input" placeholder="Enter project name" required maxlength="32" />
                </div>
                <div class="form-field">
                    <label for="project-category">Category</label>
                    <select id="project-category" class="products-fg-modal-input" required>
                        <option value="">Select category</option>
                        <option value="Audio">Audio</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Wearables">Wearables</option>
                        <option value="Cameras">Cameras</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Computers">Computers</option>
                        <option value="Storage">Storage</option>
                        <option value="Home">Home</option>
                    </select>
                </div>
                <div class="form-field">
                    <label for="project-price">Price ($)</label>
                    <input type="number" id="project-price" class="products-fg-modal-input" placeholder="Enter price" min="1" step="0.01" required />
                </div>
                <div class="form-field">
                    <label for="project-stock">Stock</label>
                    <input type="number" id="project-stock" class="products-fg-modal-input" placeholder="Enter stock" min="0" step="1" required />
                </div>
                <div class="form-field">
                    <label for="project-status">Status</label>
                    <select id="project-status" class="products-fg-modal-input" required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div class="form-field">
                    <label for="project-icon">Icon</label>
                    <select id="project-icon" class="products-fg-modal-input" required>
                        <option value="🎧">🎧 Headphones</option>
                        <option value="📱">📱 Smartphone</option>
                        <option value="⌚">⌚ Watch</option>
                        <option value="🖥️">🖥️ Monitor</option>
                        <option value="📷">📷 Camera</option>
                        <option value="🎮">🎮 Console</option>
                        <option value="🖱️">🖱️ Mouse</option>
                        <option value="💾">💾 SSD</option>
                        <option value="🤖">🤖 Robot</option>
                        <option value="🔋">🔋 Charger</option>
                        <option value="🌡️">🌡️ Thermostat</option>
                        <option value="🗂️">🗂️ Tablet</option>
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" id="cancel-modal-btn">Cancel</button>
                <button type="submit" class="btn-primary" id="save-modal-btn">Add Project</button>
            </div>
        </form>
    </div>`;
    modal.classList.remove('hidden');

    document.getElementById('cancel-modal-btn').onclick = closeProductModal;
    document.getElementById('add-project-form').onsubmit = function(e) {
        e.preventDefault();
        // Validate & collect values
        const name = document.getElementById('project-name').value.trim();
        const category = document.getElementById('project-category').value;
        const price = parseFloat(document.getElementById('project-price').value);
        const stock = parseInt(document.getElementById('project-stock').value, 10);
        const status = document.getElementById('project-status').value;
        const icon = document.getElementById('project-icon').value;
        if (!name || !category || isNaN(price) || isNaN(stock) || !status || !icon) {
            alert('Please fill all fields correctly.');
            return;
        }
        // Generate new ID
        const newId = 'P' + (mockProducts.length + 1).toString().padStart(3, '0');
        const newProduct = {
            id: newId,
            name,
            category,
            price,
            stock,
            status,
            dateAdded: new Date().toISOString().slice(0, 10),
            icon
        };
        mockProducts.push(newProduct);
        closeProductModal();
        renderProducts();
    };
}

function closeProductModal() {
    console.log('closeProductModal called');
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('modal-leave');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('modal-leave');
            modal.innerHTML = '';
        }, 400);
    }
}

function renderPaginationControls() {
    console.log('renderPaginationControls: Called. currentPage:', currentPage, 'itemsPerPage:', itemsPerPage, 'total items:', filteredProductList.length);
    const paginationInfoSpan = document.getElementById('pagination-info');
    const paginationControlsNav = document.getElementById('pagination-controls-nav');

    if (!paginationInfoSpan || !paginationControlsNav) {
        console.warn('renderPaginationControls: Pagination elements not found.');
        return;
    }

    const totalItems = filteredProductList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    paginationInfoSpan.textContent = `Showing ${startItem}-${endItem} of ${totalItems} products`;

    let paginationNavHTML = '';
    paginationNavHTML += `<button class="pagination-btn prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;

    const maxPagesToShow = 5;
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - Math.floor(maxPagesToShow / 2);
            endPage = currentPage + Math.floor(maxPagesToShow / 2);
        }
    }

    if (startPage > 1) {
        paginationNavHTML += `<button class="pagination-btn page-num" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationNavHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationNavHTML += `<button class="pagination-btn page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationNavHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationNavHTML += `<button class="pagination-btn page-num" data-page="${totalPages}">${totalPages}</button>`;
    }

    paginationNavHTML += `<button class="pagination-btn next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
    paginationControlsNav.innerHTML = paginationNavHTML;

    paginationControlsNav.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('prev-page')) {
                if (currentPage > 1) currentPage--;
            } else if (button.classList.contains('next-page')) {
                if (currentPage < totalPages) currentPage++;
            } else if (button.classList.contains('page-num')) {
                const page = parseInt(button.dataset.page, 10);
                if (page !== currentPage) currentPage = page;
            }
            console.log('Pagination button clicked. New currentPage:', currentPage);
            displayPaginatedProducts();
        });
    });
}

function displayPaginatedProducts() {
    console.log('displayPaginatedProducts: Called. currentPage:', currentPage, 'itemsPerPage:', itemsPerPage, 'filtered items:', filteredProductList.length);
    if (!tableBody) {
        console.error('displayPaginatedProducts: tableBody is not defined. Attempting to re-acquire.');
        tableBody = document.getElementById('products-table-body');
        if (!tableBody) {
            console.error('displayPaginatedProducts: tableBody still not found. Cannot render products.');
            return;
        } 
    }
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToDisplay = filteredProductList.slice(startIndex, endIndex);

    console.log('displayPaginatedProducts: Sliced products to display -', productsToDisplay.length, 'items. Start:', startIndex, 'End:', endIndex);

    renderProductTableRows(productsToDisplay);
    renderPaginationControls();
    updateSelectAllCheckboxState();
}


function renderProductTableRows(productsToDisplay) {
    console.log('renderProductTableRows: Rendering rows for', productsToDisplay.length, 'products.');
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) {
        console.error('renderProductTableRows: products-table-body not found!');
        return;
    }
    tableBody.innerHTML = ''; // Clear existing rows

    if (productsToDisplay.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="no-products-found">No products found.</td></tr>';
        return;
    }
    // Use the new Figma-style row rendering
    tableBody.innerHTML = productsToDisplay.map(product => `
      <tr>
        <td><input type="checkbox" class="products-table-checkbox"></td>
        <td>
          <div class="products-table-product">
            <span class="products-table-icon" aria-hidden="true">${product.icon}</span>
            <span class="products-table-name">${product.name}</span>
          </div>
        </td>
        <td>${product.id}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td><span class="products-status ${product.status === 'Active' ? 'active' : 'inactive'}">${product.status}</span></td>
        <td><button class="products-fg-edit-btn">Edit</button></td>
      </tr>
    `).join('');
    // Add event listeners to newly created buttons (edit/delete if needed)
    tableBody.querySelectorAll('.products-fg-edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // Implement edit modal logic here if needed
            alert('Edit product (modal logic not implemented yet)');
        });
    });

    // Add event listeners to newly created checkboxes
    tableBody.querySelectorAll('.product-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log('Individual product checkbox changed. Updating select all state.');
            updateSelectAllCheckboxState();
        });
    });
}

// Helper: Update the "select all" checkbox based on individual product checkboxes
function updateSelectAllCheckboxState() {
    const tableBody = document.getElementById('products-table-body');
    const selectAll = document.getElementById('select-all-products');
    if (!tableBody || !selectAll) return;
    const checkboxes = tableBody.querySelectorAll('.product-checkbox');
    const checked = Array.from(checkboxes).filter(cb => cb.checked);
    if (checked.length === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    } else if (checked.length === checkboxes.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
    }
}



window.addEventListener('hashchange', router);
console.log("app.js: Script end, event listeners attached.");

// ===== ACCOUNTING: FINAL PRACTICE =====
// Category 7 of Accounting Theory - Real Exam Questions

const finalPracticeData = {
    id: "xose3e",
    name: "Final Practice",
    icon: "fa-graduation-cap",
    color: "#dc2626",
    
    flashcards: [
        {
            id: "wuq7ju",
            question: "What are the three key decision-making tools in managerial accounting?",
            answer: "1. Budgeting - planning future operations\n2. CVP Analysis - understanding cost-volume-profit relationships\n3. Variance Analysis - comparing actual vs planned results",
            explanation: "Tools managers use for decisions."
        },
        {
            id: "0ivrqj",
            question: "What is the double-entry bookkeeping system?",
            answer: "Every transaction affects at least two accounts - one debit and one credit. Total debits must always equal total credits.\n\nAssets = Liabilities + Equity\n\nThis is the foundation of modern accounting.",
            explanation: "Foundation of accounting records."
        },
        {
            id: "clgb8s",
            question: "What information is found in the Notes to Financial Statements?",
            answer: "Notes provide:\n• Accounting policies used\n• Details of specific line items\n• Contingent liabilities\n• Related party transactions\n• Subsequent events\n• Additional disclosures required by GAAP",
            explanation: "Important supplemental information."
        },
        {
            id: "tqok6g",
            question: "What are the roles of the SEC and FASB?",
            answer: "SEC (Securities Exchange Commission):\n• Government regulator\n• Has legal authority over accounting standards\n• Delegates standard-setting to FASB\n\nFASB (Financial Accounting Standards Board):\n• Private organization\n• Sets GAAP (accounting standards)\n• Creates Accounting Standards Codification",
            explanation: "SEC oversees, FASB creates standards."
        },
        {
            id: "wzx3ol",
            question: "How does depreciation affect the Cash Flow Statement?",
            answer: "Depreciation is a NON-CASH expense.\n\nOn the Cash Flow Statement (Indirect Method):\n• Added back to net income in Operating Activities\n• Because it was deducted for net income but didn't actually use cash",
            explanation: "Non-cash expense is added back."
        },
        {
            id: "s8qr35",
            question: "What is the difference between FIFO and LIFO inventory methods?",
            answer: "FIFO (First-In, First-Out):\n• Oldest inventory sold first\n• Ending inventory = newer (higher) costs\n• In rising prices: Higher income, higher taxes\n\nLIFO (Last-In, First-Out):\n• Newest inventory sold first\n• Ending inventory = older (lower) costs\n• In rising prices: Lower income, lower taxes",
            explanation: "Which inventory is sold first."
        },
        {
            id: "7zzx5z",
            question: "What are the components of the Accounting Equation?",
            answer: "Assets = Liabilities + Stockholders' Equity\n\nExpanded:\nAssets = Liabilities + (Common Stock + Retained Earnings)\n\nRetained Earnings = Beginning RE + Net Income − Dividends",
            explanation: "The fundamental equation of accounting."
        },
        {
            id: "ay30bq",
            question: "What is the purpose of a Bank Reconciliation?",
            answer: "Bank Reconciliation explains the difference between:\n• Cash balance per BANK statement\n• Cash balance per BOOKS (company records)\n\nAdjustments include:\n• Outstanding checks\n• Deposits in transit\n• Bank fees and interest\n• Errors",
            explanation: "Match bank and book balances."
        }
    ],
    
    quiz: [
        {
            id: "hy96vl",
            question: "The three key managerial accounting tools are budgeting, CVP analysis, and:",
            options: ["Financial statements", "Variance analysis", "Tax preparation", "External auditing"],
            correct: 1
        },
        {
            id: "10s7jh",
            question: "In double-entry bookkeeping, every transaction affects:",
            options: ["One account", "At least two accounts", "Only assets", "Only equity"],
            correct: 1
        },
        {
            id: "1jjgro",
            question: "Notes to Financial Statements provide:",
            options: ["Marketing information", "Accounting policies and additional disclosures", "Employee salaries", "Customer lists"],
            correct: 1
        },
        {
            id: "im38o7",
            question: "FASB is responsible for:",
            options: ["Enforcing tax laws", "Setting GAAP standards", "Prosecuting fraud", "Managing banks"],
            correct: 1
        },
        {
            id: "hm9hi1",
            question: "On the Cash Flow Statement, depreciation is:",
            options: ["Subtracted from net income", "Added back to net income", "Ignored", "Shown as investing activity"],
            correct: 1
        },
        {
            id: "hko66l",
            question: "FIFO in rising prices results in:",
            options: ["Lower income", "Higher income and higher taxes", "No tax effect", "Lower inventory value"],
            correct: 1
        },
        {
            id: "e37w0p",
            question: "The Accounting Equation is:",
            options: ["Revenue = Expenses", "Assets = Liabilities + Equity", "Cash = Revenue - Expenses", "Profit = Sales - Costs"],
            correct: 1
        },
        {
            id: "bnwct0",
            question: "Bank reconciliation explains the difference between:",
            options: ["Revenue and expenses", "Bank balance and book balance", "Assets and liabilities", "Income and cash flow"],
            correct: 1
        },
        {
            id: "dqgg7j",
            question: "SEC is a:",
            options: ["Private organization", "Government regulator", "Accounting firm", "Bank"],
            correct: 1
        },
        {
            id: "i40fma",
            question: "LIFO in rising prices results in:",
            options: ["Higher income", "Lower income and lower taxes", "Same as FIFO", "Higher inventory value"],
            correct: 1
        },
        {
            id: "avq46d",
            question: "Outstanding checks on bank reconciliation are:",
            options: ["Added to bank balance", "Subtracted from bank balance", "Added to book balance", "Ignored"],
            correct: 1
        },
        {
            id: "uskbmi",
            question: "Deposits in transit on bank reconciliation are:",
            options: ["Subtracted from bank balance", "Added to bank balance", "Subtracted from book balance", "Ignored"],
            correct: 1
        },
        {
            id: "8jw2ox",
            question: "What is CVP analysis used for?",
            options: ["Tax calculation", "Understanding cost-volume-profit relationships", "Bank reconciliation", "Depreciation calculation"],
            correct: 1
        },
        {
            id: "qaaxpl",
            question: "Retained Earnings equals:",
            options: ["Net Income only", "Beginning RE + Net Income - Dividends", "Total Revenue", "Total Assets"],
            correct: 1
        },
        {
            id: "gx6jvu",
            question: "Which inventory method is NOT allowed under IFRS?",
            options: ["FIFO", "LIFO", "Weighted Average", "Specific Identification"],
            correct: 1
        }
    ],
    
    fillBlanks: [
        {
            id: "ks8flq",
            sentence: "The three managerial accounting tools are budgeting, CVP analysis, and _______ analysis.",
            answer: "variance",
            hint: "Comparing actual vs planned..."
        },
        {
            id: "b3c50m",
            sentence: "In double-entry bookkeeping, debits must equal _______.",
            answer: "credits",
            hint: "The other side of entries..."
        },
        {
            id: "kt9mf1",
            sentence: "_______ sets GAAP accounting standards.",
            answer: "FASB",
            hint: "Financial Accounting Standards..."
        },
        {
            id: "irnt8i",
            sentence: "Depreciation is a _______-cash expense.",
            answer: "non",
            hint: "No actual money leaves..."
        },
        {
            id: "2gonmp",
            sentence: "_______ = Beginning RE + Net Income − Dividends",
            answer: "Retained Earnings",
            hint: "Accumulated profits..."
        },
        {
            id: "2f4o29",
            sentence: "Bank _______ explains difference between bank and book balance.",
            answer: "reconciliation",
            hint: "Matching up balances..."
        },
        {
            id: "y0ueeb",
            sentence: "_______ assumes oldest inventory is sold first.",
            answer: "FIFO",
            hint: "First-In, First-..."
        },
        {
            id: "8safpm",
            sentence: "SEC is a government _______ of financial markets.",
            answer: "regulator",
            hint: "Oversees and enforces..."
        },
        {
            id: "tj5500",
            sentence: "Outstanding _______ are subtracted from bank balance in reconciliation.",
            answer: "checks",
            hint: "Written but not yet cashed..."
        },
        {
            id: "kd4kz4",
            sentence: "The accounting equation: Assets = Liabilities + _______.",
            answer: "Equity",
            hint: "Owners' stake..."
        }
    ],
    
    learn: {
        id: "o5cdac",
        title: "Final Practice: Comprehensive Review",
        content: `
            <h3>📚 Final Review: All Key Concepts</h3>
            
            <div class="tip-box" style="text-align: center; background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.2)); border-left-color: #dc2626;">
                <h4 style="color: #dc2626; font-size: 1.2rem;">🎓 Final Exam Preparation</h4>
                <p style="margin: 0;">Key concepts from all chapters • Focus on most-tested topics</p>
            </div>
            
            <p>This section covers the most important concepts that appear frequently on exams.</p>
            
            <hr>
            
            <h4>⚖️ The Accounting Equation</h4>
            
            <div class="example-box" style="text-align: center;">
                <h4 style="margin-top: 0;">The Foundation of All Accounting</h4>
                <p style="font-size: 1.5rem; margin: 15px 0;"><strong>Assets = Liabilities + Equity</strong></p>
                <p>This equation MUST always balance!</p>
            </div>
            
            <div class="formula-box">
                <strong>Expanded Equation:</strong><br>
                Assets = Liabilities + Common Stock + Retained Earnings<br><br>
                <strong>Retained Earnings:</strong><br>
                RE = Beginning RE + Net Income − Dividends<br><br>
                <strong>Net Income:</strong><br>
                Net Income = Revenue − Expenses
            </div>
            
            <hr>
            
            <h4>📒 Double-Entry Bookkeeping</h4>
            
            <div class="formula-box">
                <strong>Every transaction affects at least TWO accounts</strong><br><br>
                <strong>DEBITS (Left side):</strong><br>
                • Increase Assets<br>
                • Increase Expenses<br>
                • Decrease Liabilities<br>
                • Decrease Equity<br>
                • Decrease Revenue<br><br>
                
                <strong>CREDITS (Right side):</strong><br>
                • Increase Liabilities<br>
                • Increase Equity<br>
                • Increase Revenue<br>
                • Decrease Assets<br>
                • Decrease Expenses
            </div>
            
            <hr>
            
            <h4>📊 Three Financial Statements</h4>
            
            <table style="width:100%; border-collapse: collapse; margin: 15px 0;">
                <tr style="background: rgba(220,38,38,0.2);">
                    <th style="padding: 10px; border: 1px solid #ccc;">Statement</th>
                    <th style="padding: 10px; border: 1px solid #ccc;">Shows</th>
                    <th style="padding: 10px; border: 1px solid #ccc;">Time Period</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Income Statement</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Revenue - Expenses = Net Income</td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Period (month, quarter, year)</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Balance Sheet</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Assets = Liabilities + Equity</td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Point in time (snapshot)</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ccc;"><strong>Cash Flow Statement</strong></td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Operating, Investing, Financing activities</td>
                    <td style="padding: 10px; border: 1px solid #ccc;">Period</td>
                </tr>
            </table>
            
            <hr>
            
            <h4>🏛️ SEC and FASB Roles</h4>
            
            <div class="formula-box">
                <strong>SEC (Securities Exchange Commission):</strong><br>
                • Government agency<br>
                • Has legal authority over financial reporting<br>
                • Requires public companies to file reports (10-K, 10-Q)<br>
                • Enforces securities laws<br><br>
                
                <strong>FASB (Financial Accounting Standards Board):</strong><br>
                • Private organization<br>
                • Sets GAAP (Generally Accepted Accounting Principles)<br>
                • Creates Accounting Standards Codification (ASC)<br>
                • SEC delegates standard-setting to FASB
            </div>
            
            <hr>
            
            <h4>📦 Inventory Methods</h4>
            
            <div class="formula-box">
                <strong>FIFO (First-In, First-Out):</strong><br>
                • Oldest items sold first<br>
                • Ending inventory at newer (higher) costs<br>
                • Rising prices = Higher income, Higher taxes<br><br>
                
                <strong>LIFO (Last-In, First-Out):</strong><br>
                • Newest items sold first<br>
                • Ending inventory at older (lower) costs<br>
                • Rising prices = Lower income, Lower taxes<br>
                • NOT allowed under IFRS!<br><br>
                
                <strong>Weighted Average:</strong><br>
                • Average cost of all items<br>
                • Smooths out price fluctuations
            </div>
            
            <hr>
            
            <h4>🏦 Bank Reconciliation</h4>
            
            <div class="formula-box">
                <strong>Adjust BANK Balance:</strong><br>
                + Deposits in transit (sent but not recorded by bank)<br>
                − Outstanding checks (written but not cashed)<br>
                ± Bank errors<br><br>
                
                <strong>Adjust BOOK Balance:</strong><br>
                + Interest earned (recorded by bank, not books)<br>
                − Bank fees (recorded by bank, not books)<br>
                − NSF checks (bounced checks)<br>
                ± Book errors
            </div>
            
            <hr>
            
            <h4>💰 Depreciation on Cash Flow</h4>
            
            <p>Depreciation is a <strong>NON-CASH</strong> expense.</p>
            
            <div class="formula-box">
                <strong>Cash Flow Statement (Indirect Method):</strong><br><br>
                Net Income<br>
                <strong>+ Depreciation Expense</strong> (added back)<br>
                ± Changes in working capital<br>
                = Cash from Operating Activities<br><br>
                <em>Why add back? Because depreciation reduced net income but no cash was spent.</em>
            </div>
            
            <hr>
            
            <h4>📊 Managerial Accounting Tools</h4>
            
            <div class="formula-box">
                <strong>1. Budgeting:</strong><br>
                Planning future operations, revenues, expenses<br><br>
                
                <strong>2. CVP Analysis (Cost-Volume-Profit):</strong><br>
                Break-even point = Fixed Costs ÷ Contribution Margin per Unit<br><br>
                
                <strong>3. Variance Analysis:</strong><br>
                Compare actual results vs budgeted/planned amounts<br>
                Favorable = Better than planned<br>
                Unfavorable = Worse than planned
            </div>
            
            <hr>
            
            <h4>📝 Notes to Financial Statements</h4>
            <ul>
                <li>Accounting policies used (depreciation method, inventory method)</li>
                <li>Details of specific line items</li>
                <li>Contingent liabilities (potential lawsuits)</li>
                <li>Related party transactions</li>
                <li>Subsequent events (after balance sheet date)</li>
                <li>Long-term debt details</li>
                <li>Lease commitments</li>
            </ul>
            
            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Exam Quick Reference</h4>
                <ul>
                    <li>Assets = Liabilities + Equity (MEMORIZE!)</li>
                    <li>Debits = Left, Credits = Right</li>
                    <li>FASB sets GAAP; SEC enforces</li>
                    <li>FIFO rising prices = higher income/taxes</li>
                    <li>LIFO not allowed under IFRS</li>
                    <li>Depreciation: Add back on Cash Flow</li>
                    <li>Outstanding checks: Subtract from BANK</li>
                    <li>Deposits in transit: Add to BANK</li>
                </ul>
            </div>
        `
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = finalPracticeData;
}

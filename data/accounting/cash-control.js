// ===== ACCOUNTING: CASH & INTERNAL CONTROL =====
// Category 1 of Accounting Theory

const cashControlData = {
    id: "pd8d2s",
    name: "Cash & Internal Control",
    icon: "fa-shield-halved",
    color: "#059669",
    
    flashcards: [
        {
            id: "wqg415",
            question: "What items are included in cash?",
            answer: "Cash includes:\n• Currency and coins on hand\n• Bank deposits\n• Checks received from customers\n• Money orders\n• Other negotiable instruments\n• Undeposited cash receipts\n• Cash in house banks",
            explanation: "Cash must be readily available for use."
        },
        {
            id: "cu581s",
            question: "What is the definition of internal control?",
            answer: "Internal control is a system of policies and procedures designed to:\n• Protect assets\n• Ensure accurate accounting records\n• Promote operational efficiency\n• Encourage adherence to management policies",
            explanation: "Internal control is the foundation of reliable financial reporting."
        },
        {
            id: "oo3ibr",
            question: "What are the four main objectives of internal control?",
            answer: "1. Safeguarding assets\n2. Ensuring reliability and accuracy of accounting records\n3. Promoting operational efficiency\n4. Ensuring compliance with laws and company policies",
            explanation: "These objectives protect the business from fraud and errors."
        },
        {
            id: "fb9u1z",
            question: "What assets are intended to be safeguarded by internal control?",
            answer: "Assets to be safeguarded include:\n• Cash\n• Inventory\n• Equipment\n• Furnishings\n• Supplies\n• Other property\n• Accounting records\n• Financial information",
            explanation: "Both physical assets and information need protection."
        },
        {
            id: "7lb9cx",
            question: "What is collusion?",
            answer: "Collusion occurs when two or more employees work together to circumvent internal control procedures, usually to commit fraud or theft that would be difficult for one person to accomplish alone.",
            explanation: "Collusion is a significant threat to internal controls."
        },
        {
            id: "iyi01k",
            question: "What is the advantage of bonding employees?",
            answer: "Bonding employees:\n• Provides financial protection against losses caused by employee dishonesty\n• Acts as a deterrent to theft or fraud\n• Allows recovery of losses by the company",
            explanation: "Bonded employees know that losses can be recovered."
        },
        {
            id: "zw6d4z",
            question: "What is an internal control procedure for house banks?",
            answer: "Assign responsibility for each house bank to one specific employee and require that the bank be counted and reconciled at the beginning and end of each shift.",
            explanation: "Single responsibility ensures accountability."
        },
        {
            id: "g8r4cq",
            question: "What is the purpose of the cashier's daily report?",
            answer: "The cashier's daily report:\n• Summarizes all cash transactions for the day\n• Reconciles cash received with recorded sales\n• Provides documentation for accounting and management review",
            explanation: "Essential for cash control and accountability."
        },
        {
            id: "vms6h1",
            question: "What is the purpose of a bank reconciliation?",
            answer: "Bank reconciliation:\n• Explains differences between bank statement and company's cash records\n• Detects errors or irregularities\n• Ensures accuracy of the cash account",
            explanation: "Reconciliation is a key control procedure."
        },
        {
            id: "joh851",
            question: "What are canceled checks?",
            answer: "Canceled checks are checks that have been paid by the bank and returned to the check writer as proof of payment.",
            explanation: "They serve as evidence that payment was made."
        },
        {
            id: "tbjgxf",
            question: "What is a deposit in transit?",
            answer: "A deposit in transit is cash receipts that have been recorded by the company but not yet recorded by the bank.",
            explanation: "Timing difference - company recorded first."
        },
        {
            id: "p7ks17",
            question: "What are outstanding checks?",
            answer: "Outstanding checks are checks that have been written and recorded by the company but not yet paid by the bank.",
            explanation: "Timing difference - bank hasn't processed yet."
        },
        {
            id: "c1js7w",
            question: "What is an NSF check?",
            answer: "NSF (Non-Sufficient Funds) check is a check returned by the bank because the issuer does not have enough funds in their account to cover the check.",
            explanation: "Also known as a 'bounced check'."
        },
        {
            id: "mig2e9",
            question: "Why does the bank statement balance generally not equal the checkbook balance?",
            answer: "Balances differ due to timing differences:\n• Outstanding checks\n• Deposits in transit\n• Bank service charges\n• NSF checks\n• Errors by bank or company",
            explanation: "These items are recorded at different times."
        },
        {
            id: "d85gbn",
            question: "What are the 5 components of COSO Internal Control Framework?",
            answer: "1. Control Environment - tone at the top, ethics, integrity\n2. Risk Assessment - identifying and analyzing risks\n3. Control Activities - policies and procedures\n4. Information & Communication - relevant info flows\n5. Monitoring Activities - ongoing evaluations",
            explanation: "COSO framework is the gold standard for internal control."
        },
        {
            id: "lzpe4j",
            question: "What is Separation of Duties and why is it important?",
            answer: "Separation of Duties means dividing responsibilities among different employees so no single person controls all aspects of a transaction.\n\nThree functions to separate:\n• Authorization\n• Custody of assets\n• Record keeping\n\nThis prevents fraud and errors.",
            explanation: "One person should never handle a transaction from start to finish."
        },
        {
            id: "scbtg0",
            question: "What is a Petty Cash Fund?",
            answer: "A petty cash fund is a small amount of cash kept on hand to pay for minor expenses that are impractical to pay by check.\n\nControls include:\n• Fixed fund amount\n• One custodian responsible\n• Receipts required for all disbursements\n• Periodic surprise counts",
            explanation: "Used for small, incidental expenses."
        },
        {
            id: "xjjqcm",
            question: "What are prenumbered documents and why are they used?",
            answer: "Prenumbered documents are forms (checks, invoices, receipts) printed with sequential numbers.\n\nPurpose:\n• Track all documents\n• Detect missing or duplicate transactions\n• Establish audit trail\n• Prevent unauthorized transactions",
            explanation: "Essential for transaction tracking and accountability."
        },
        {
            id: "iddtlr",
            question: "What is the purpose of surprise audits?",
            answer: "Surprise audits are unannounced examinations of records or cash.\n\nBenefits:\n• Deter fraud (employees don't know when audit will occur)\n• Detect irregularities before they grow\n• Test effectiveness of controls\n• Keep employees vigilant",
            explanation: "The element of surprise is key to effectiveness."
        },
        {
            id: "u6g3ek",
            question: "What is the difference between authorization and approval?",
            answer: "Authorization: General permission to perform transactions within set limits (e.g., manager can approve purchases up to $500)\n\nApproval: Specific permission for a particular transaction (e.g., signing a specific purchase order)\n\nBoth are control activities that ensure proper review.",
            explanation: "Authorization sets limits; approval is for specific actions."
        },
        {
            id: "debbwx",
            question: "What are the steps in a Bank Reconciliation?",
            answer: "1. Start with bank statement ending balance\n2. Add: Deposits in transit\n3. Subtract: Outstanding checks\n4. = Adjusted bank balance\n\n5. Start with book balance\n6. Add: Bank collections, interest earned\n7. Subtract: Service charges, NSF checks\n8. = Adjusted book balance\n\nBoth adjusted balances should match!",
            explanation: "Systematic process to reconcile two balances."
        },
        {
            id: "a66lbi",
            question: "What is a Cash Over and Short account?",
            answer: "Cash Over and Short is an account used to record differences between actual cash and the amount that should be in the cash register.\n\n• Debit (expense) if cash is SHORT\n• Credit (revenue) if cash is OVER\n\nLarge or frequent differences indicate control problems.",
            explanation: "Tracks cashier accuracy and potential theft."
        }
    ],
    
    quiz: [
        {
            id: "kvz7yl",
            question: "Which is NOT included in cash?",
            options: ["Currency on hand", "Bank deposits", "Accounts receivable", "Checks from customers"],
            correct: 2
        },
        {
            id: "cvlvk8",
            question: "What is the main purpose of internal control?",
            options: ["Increase profits", "Protect assets and ensure accuracy", "Reduce employees", "Expand business"],
            correct: 1
        },
        {
            id: "wt02h0",
            question: "Collusion involves:",
            options: ["One employee stealing", "Two or more employees working together to circumvent controls", "Management fraud only", "External hackers"],
            correct: 1
        },
        {
            id: "hygto3",
            question: "Bonding employees provides protection against:",
            options: ["Natural disasters", "Employee dishonesty", "Market changes", "Competition"],
            correct: 1
        },
        {
            id: "81xhoq",
            question: "A deposit in transit is:",
            options: ["Recorded by bank but not company", "Recorded by company but not bank yet", "A canceled check", "An NSF check"],
            correct: 1
        },
        {
            id: "ojpr1v",
            question: "Outstanding checks are:",
            options: ["Paid by the bank", "Written by company but not yet paid by bank", "Canceled checks", "Deposits"],
            correct: 1
        },
        {
            id: "mt7xoy",
            question: "NSF stands for:",
            options: ["National Security Fund", "Non-Sufficient Funds", "New Standard Format", "Net Sales Figure"],
            correct: 1
        },
        {
            id: "nd9kv8",
            question: "How many main objectives does internal control have?",
            options: ["2", "3", "4", "5"],
            correct: 2
        },
        {
            id: "f45m4k",
            question: "The cashier's daily report is used to:",
            options: ["Fire employees", "Summarize and reconcile cash transactions", "Order supplies", "Set prices"],
            correct: 1
        },
        {
            id: "rctmf3",
            question: "Bank reconciliation helps to:",
            options: ["Increase sales", "Detect errors and ensure cash accuracy", "Hire employees", "Buy equipment"],
            correct: 1
        },
        {
            id: "vp0hv6",
            question: "How many components does the COSO Internal Control Framework have?",
            options: ["3", "4", "5", "6"],
            correct: 2
        },
        {
            id: "odely1",
            question: "Separation of Duties requires separating which three functions?",
            options: ["Sales, Marketing, Finance", "Authorization, Custody, Record keeping", "Hiring, Training, Firing", "Planning, Organizing, Controlling"],
            correct: 1
        },
        {
            id: "fty50l",
            question: "A petty cash fund is used for:",
            options: ["Large purchases", "Employee salaries", "Small incidental expenses", "Investments"],
            correct: 2
        },
        {
            id: "9vedrg",
            question: "Prenumbered documents help to:",
            options: ["Increase profits", "Track transactions and detect missing documents", "Reduce taxes", "Hire employees"],
            correct: 1
        },
        {
            id: "8xb9yt",
            question: "The purpose of surprise audits is to:",
            options: ["Scare employees", "Deter fraud and detect irregularities", "Increase workload", "Reduce costs"],
            correct: 1
        },
        {
            id: "bkegky",
            question: "Which is NOT a component of COSO framework?",
            options: ["Control Environment", "Risk Assessment", "Profit Maximization", "Monitoring Activities"],
            correct: 2
        },
        {
            id: "gmbz9o",
            question: "Cash Over and Short account records:",
            options: ["Bank loans", "Differences between actual and expected cash", "Employee salaries", "Inventory"],
            correct: 1
        }
    ],
    
    fillBlanks: [
        {
            id: "p3jmbe",
            sentence: "_______ occurs when two or more employees work together to circumvent internal controls.",
            answer: "Collusion",
            hint: "Working together for fraud..."
        },
        {
            id: "b8loq8",
            sentence: "NSF stands for Non-_______ Funds.",
            answer: "Sufficient",
            hint: "Not enough..."
        },
        {
            id: "e0pbca",
            sentence: "A _______ in transit is recorded by the company but not yet by the bank.",
            answer: "deposit",
            hint: "Money put into account..."
        },
        {
            id: "d04zde",
            sentence: "_______ checks have been written but not yet paid by the bank.",
            answer: "Outstanding",
            hint: "Still out there..."
        },
        {
            id: "3j17tg",
            sentence: "_______ employees provides financial protection against dishonesty.",
            answer: "Bonding",
            hint: "Insurance against theft..."
        },
        {
            id: "wdznsm",
            sentence: "The COSO framework has _______ components of internal control.",
            answer: "five",
            hint: "5..."
        },
        {
            id: "uc8f3t",
            sentence: "_______ of Duties separates authorization, custody, and record keeping.",
            answer: "Separation",
            hint: "Dividing responsibilities..."
        },
        {
            id: "8oelw7",
            sentence: "A _______ cash fund is used for small incidental expenses.",
            answer: "petty",
            hint: "Small, minor..."
        },
        {
            id: "07q005",
            sentence: "_______ documents are printed with sequential numbers to track transactions.",
            answer: "Prenumbered",
            hint: "Numbers printed in advance..."
        },
        {
            id: "ur25ni",
            sentence: "_______ audits are unannounced examinations that deter fraud.",
            answer: "Surprise",
            hint: "Unexpected..."
        },
        {
            id: "r4lqd6",
            sentence: "Cash Over and _______ account records differences in cash register.",
            answer: "Short",
            hint: "Over and..."
        }
    ],
    
    learn: {
        id: "rduif4",
        title: "Cash and Internal Control",
        content: `
            <h3>📚 Chapter Overview: Cash and Internal Control</h3>
            <p>This chapter covers the fundamentals of cash management and the internal control systems that protect a hospitality business's most liquid asset.</p>
            
            <hr>
            
            <h4>💰 What is Cash?</h4>
            <p>In accounting, <strong>cash</strong> refers to the most liquid assets that are readily available for use. Cash includes:</p>
            <ul>
                <li>Currency and coins on hand</li>
                <li>Bank deposits (checking and savings accounts)</li>
                <li>Checks received from customers</li>
                <li>Money orders and traveler's checks</li>
                <li>Other negotiable instruments</li>
                <li>Undeposited cash receipts</li>
                <li>Cash in house banks (front desk, restaurants, bars)</li>
            </ul>
            
            <div class="warning-box">
                <h4>⚠️ NOT Cash:</h4>
                <p>Accounts receivable, inventory, prepaid expenses, and investments are NOT considered cash because they cannot be immediately used for payments.</p>
            </div>
            
            <hr>
            
            <h4>🛡️ Internal Control Definition</h4>
            <p><strong>Internal control</strong> is a comprehensive system of policies, procedures, and practices designed by management to:</p>
            
            <div class="formula-box">
                <strong>4 Main Objectives of Internal Control:</strong><br><br>
                <strong>1. Safeguard Assets</strong> - Protect cash, inventory, equipment from theft or misuse<br><br>
                <strong>2. Ensure Accuracy</strong> - Maintain reliable and accurate accounting records<br><br>
                <strong>3. Promote Efficiency</strong> - Encourage operational effectiveness<br><br>
                <strong>4. Ensure Compliance</strong> - Adhere to laws, regulations, and company policies
            </div>
            
            <hr>
            
            <h4>🏛️ COSO Internal Control Framework</h4>
            
            <div class="tip-box" style="text-align: center; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.2)); border-left-color: var(--primary);">
                <h4 style="color: var(--primary); font-size: 1.3rem;">🏗️ COSO = Committee of Sponsoring Organizations</h4>
                <p style="margin: 0;">The Gold Standard for Internal Control - 5 Interrelated Components</p>
            </div>
            
            <p>The <strong>Committee of Sponsoring Organizations (COSO)</strong> framework is the gold standard for internal control. It has <strong>5 interrelated components</strong>:</p>
            
            <div class="formula-box">
                <strong>5 Components of COSO Framework:</strong><br><br>
                <strong>1. Control Environment</strong><br>
                The "tone at the top" - management's integrity, ethical values, and commitment to competence<br><br>
                
                <strong>2. Risk Assessment</strong><br>
                Identifying and analyzing risks that may prevent achieving objectives<br><br>
                
                <strong>3. Control Activities</strong><br>
                Policies and procedures that ensure management directives are carried out (approvals, authorizations, verifications, reconciliations)<br><br>
                
                <strong>4. Information & Communication</strong><br>
                Relevant information must be identified, captured, and communicated in a timely manner<br><br>
                
                <strong>5. Monitoring Activities</strong><br>
                Ongoing evaluations to assess whether controls are functioning effectively
            </div>
            
            <hr>
            
            <h4>🔐 Key Control Principles</h4>
            
            <h5>Separation of Duties</h5>
            <p>The most critical internal control principle. <strong>No single person</strong> should control all aspects of a transaction. Three functions must be separated:</p>
            <ul>
                <li><strong>Authorization</strong> - Approving transactions</li>
                <li><strong>Custody</strong> - Physical control of assets</li>
                <li><strong>Record Keeping</strong> - Recording transactions</li>
            </ul>
            
            <div class="example-box">
                <h4>📝 Example: Hotel Front Desk</h4>
                <p>• Night auditor (records) ≠ Cashier (custody) ≠ Manager (authorization)</p>
                <p>• If one person does all three, they could steal cash and cover it up in records!</p>
            </div>
            
            <h5>Prenumbered Documents</h5>
            <p>All important documents (checks, invoices, receipts) should have sequential numbers to:</p>
            <ul>
                <li>Track all transactions</li>
                <li>Detect missing or duplicate documents</li>
                <li>Establish an audit trail</li>
            </ul>
            
            <h5>Bonding Employees</h5>
            <p>Fidelity bonds provide insurance against employee dishonesty. Benefits:</p>
            <ul>
                <li>Financial recovery if theft occurs</li>
                <li>Deterrent effect - employees know losses can be recovered</li>
                <li>Background checks during bonding process</li>
            </ul>
            
            <h5>Surprise Audits</h5>
            <p>Unannounced examinations of cash and records. The unpredictability is the key - employees never know when an audit might occur.</p>
            
            <hr>
            
            <h4>🏨 House Banks in Hospitality</h4>
            <p>A <strong>house bank</strong> is a fixed amount of cash assigned to a cashier for making change. Controls include:</p>
            <ul>
                <li>One specific employee responsible for each bank</li>
                <li>Count and reconcile at beginning and end of each shift</li>
                <li>Bank amount should remain constant</li>
                <li>Overages and shortages investigated</li>
            </ul>
            
            <h5>Petty Cash Fund</h5>
            <p>A small amount of cash kept for minor expenses. Controls:</p>
            <ul>
                <li>Fixed fund amount (e.g., $200)</li>
                <li>One custodian responsible</li>
                <li>Receipts required for ALL disbursements</li>
                <li>Cash + Receipts must always equal fund total</li>
            </ul>
            
            <hr>
            
            <h4>🏦 Bank Reconciliation</h4>
            
            <div class="tip-box" style="text-align: center; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));">
                <h4>📊 Bank Statement ↔️ Company Records</h4>
                <p style="margin: 0;">Reconciliation ensures both balances match after adjustments</p>
            </div>
            
            <p>A <strong>bank reconciliation</strong> explains differences between the bank statement balance and the company's book balance. It should be performed monthly by someone who does NOT handle cash.</p>
            
            <div class="formula-box">
                <strong>Bank Reconciliation Procedure:</strong><br><br>
                <strong>BANK SIDE:</strong><br>
                Bank Statement Balance<br>
                + Deposits in Transit<br>
                − Outstanding Checks<br>
                ± Bank Errors<br>
                = <strong>Adjusted Bank Balance</strong><br><br>
                
                <strong>BOOK SIDE:</strong><br>
                Book Balance (per records)<br>
                + Bank Collections, Interest Earned<br>
                − Service Charges, NSF Checks<br>
                ± Book Errors<br>
                = <strong>Adjusted Book Balance</strong><br><br>
                
                <em>Both adjusted balances must be equal!</em>
            </div>
            
            <h5>Key Terms:</h5>
            <ul>
                <li><strong>Deposit in Transit:</strong> Recorded by company but not yet by bank (ADD to bank)</li>
                <li><strong>Outstanding Check:</strong> Written by company but not yet paid by bank (SUBTRACT from bank)</li>
                <li><strong>NSF Check:</strong> "Bounced" check - insufficient funds (SUBTRACT from books)</li>
                <li><strong>Canceled Check:</strong> Check that has been paid and returned as proof</li>
            </ul>
            
            <hr>
            
            <h4>📊 Cash Over and Short</h4>
            <p>When actual cash differs from expected amount:</p>
            <ul>
                <li><strong>Cash Short:</strong> Actual < Expected → Debit (expense)</li>
                <li><strong>Cash Over:</strong> Actual > Expected → Credit (revenue)</li>
            </ul>
            <p>Large or frequent differences indicate control problems and should be investigated!</p>
            
            <hr>
            
            <h4>🚨 Collusion</h4>
            <p><strong>Collusion</strong> occurs when two or more employees work together to circumvent internal controls. It's the biggest threat to any control system because:</p>
            <ul>
                <li>Separation of duties is defeated</li>
                <li>Harder to detect than individual fraud</li>
                <li>Usually involves larger amounts</li>
            </ul>
            
            <div class="tip-box">
                <h4><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                <ul>
                    <li>Internal control protects assets and ensures accurate records</li>
                    <li>COSO framework has 5 components - memorize them!</li>
                    <li>Separation of duties = Authorization + Custody + Record keeping SEPARATED</li>
                    <li>Bank reconciliation reconciles BANK balance with BOOK balance</li>
                    <li>Deposits in transit: ADD to bank; Outstanding checks: SUBTRACT from bank</li>
                    <li>Collusion defeats separation of duties</li>
                </ul>
            </div>
        `
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cashControlData;
}

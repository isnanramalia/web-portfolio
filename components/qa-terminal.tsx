"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Play, Square, RefreshCw, X, ChevronRight, FileCode, FolderClosed, TerminalSquare } from "lucide-react";

interface LogLine {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR" | "COMMAND";
  text: string;
}

const SECTION_LOGS: Record<string, Omit<LogLine, "timestamp">[]> = {
  about: [
    { level: "COMMAND", text: "node test_about.js --env=production" },
    { level: "INFO", text: "Initializing WebDriver instance for Chrome (headless=true)..." },
    { level: "SUCCESS", text: "WebDriver session created: chrome_88.0.4324" },
    { level: "INFO", text: "Navigating to user_portfolio biography..." },
    { level: "INFO", text: "Finding element selector: #sidebar-photo-card" },
    { level: "SUCCESS", text: "Assertion PASSED: Profile photo visible, dimensions verified" },
    { level: "INFO", text: "Scanning work history timeline data..." },
    { level: "SUCCESS", text: "Assertion PASSED: 3 timeline entries rendered with valid dates" },
    { level: "SUCCESS", text: "PASSED: test_about.js completed. 0 failures." }
  ],
  skills: [
    { level: "COMMAND", text: "pytest tests/test_skills.py --verbose" },
    { level: "INFO", text: "Initializing Python PyTest runner..." },
    { level: "INFO", text: "Simulating user hover on skill badge: 'Next.js'" },
    { level: "SUCCESS", text: "Assertion PASSED: Tooltip triggered showing 'Next.js (3 years)'" },
    { level: "INFO", text: "Testing drag-and-drop collision response on Skills Grid..." },
    { level: "SUCCESS", text: "Assertion PASSED: Matter.js engine resolved collision coordinates" },
    { level: "SUCCESS", text: "PASSED: test_skills.py - 100% assertions satisfied." }
  ],
  projects: [
    { level: "COMMAND", text: "npx playwright test saucedemo_cart.spec.js" },
    { level: "INFO", text: "Running SauceDemo e-commerce integration assertions..." },
    { level: "INFO", text: "Navigating to: https://www.saucedemo.com/" },
    { level: "SUCCESS", text: "Auth: Login successful for user 'standard_user'" },
    { level: "INFO", text: "Selecting item 'Sauce Labs Backpack' -> Clicking 'Add to Cart'" },
    { level: "SUCCESS", text: "Assertion PASSED: Shopping cart badge count updated to '1'" },
    { level: "INFO", text: "Navigating to Checkout: Step One (Information)..." },
    { level: "INFO", text: "Sending inputs: firstName='Isna', lastName='QA', postalCode='50123'" },
    { level: "INFO", text: "Clicking 'Continue' -> Navigating to Checkout Overview..." },
    { level: "SUCCESS", text: "Assertion PASSED: Total checkout price matches ($32.39)" },
    { level: "SUCCESS", text: "Action: Clicked 'Finish' checkout button" },
    { level: "SUCCESS", text: "Verified order message: 'Thank you for your order!'" },
    { level: "SUCCESS", text: "PASSED: saucedemo_cart.spec.js - 8 of 8 steps PASSED." }
  ],
  writing: [
    { level: "COMMAND", text: "newman run medium_blog_tests.json" },
    { level: "INFO", text: "Starting Postman Newman REST API collections..." },
    { level: "INFO", text: "GET: https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@isnanramalia" },
    { level: "SUCCESS", text: "Response Status: 200 OK (Time: 218ms)" },
    { level: "SUCCESS", text: "Assertion PASSED: Response body contains valid articles array" },
    { level: "SUCCESS", text: "PASSED: medium_blog_tests.json integrations validated." }
  ],
  contact: [
    { level: "COMMAND", text: "python -m unittest tests/test_contact_form.py" },
    { level: "INFO", text: "Starting contact form regression test cases..." },
    { level: "INFO", text: "Injecting invalid email syntax and verifying client warning..." },
    { level: "SUCCESS", text: "Assertion PASSED: Form blocked submission, regex alert displayed" },
    { level: "INFO", text: "Injecting valid contact payload and clicking submit..." },
    { level: "SUCCESS", text: "Assertion PASSED: Client success toast notification visible" },
    { level: "SUCCESS", text: "PASSED: test_contact_form.py workflow completed successfully." }
  ]
};

const SECTION_CODE: Record<string, string> = {
  about: `// test_about.js
const { Builder, By } = require('selenium-webdriver');

describe('About Section assertions', () => {
  it('Should verify profile photo bounds', async () => {
    await driver.get('https://isna.dev/about');
    const photo = await driver.findElement(By.id('sidebar-photo-card'));
    expect(await photo.isDisplayed()).to.be.true;
  });
});`,

  skills: `# tests/test_skills.py
import pytest

def test_skills_interactivity(driver):
    driver.get("https://isna.dev/skills")
    badge = driver.find_element_by_id("skill-nextjs")
    actions.move_to_element(badge).perform()
    tooltip = driver.find_element_by_class_name("tooltip")
    assert tooltip.text == "Next.js (3 years experience)"`,

  projects: `// tests/saucedemo_cart.spec.js
const { test, expect } = require('@playwright/test');

test('SauceDemo Checkout Flow', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  
  await page.click('#add-to-cart-sauce-labs-backpack');
  const badge = page.locator('.shopping_cart_badge');
  await expect(badge).toHaveText('1');
});`,

  writing: `// collections/medium_blog_tests.json
{
  "name": "Medium Feed Parsing Check",
  "item": [{
    "name": "Get Medium Feed JSON",
    "request": {
      "url": "https://api.rss2json.com/v1/api.json?rss_url=..."
    },
    "event": [{
      "listen": "test",
      "script": "pm.test('Posts exist', () => { pm.expect(pm.response.json().items.length).to.be.above(0); });"
    }]
  }]
}`,

  contact: `# tests/test_contact_form.py
def test_contact_form_validation(driver):
    driver.get("https://isna.dev/contact")
    driver.find_element_by_name("email").send_keys("invalid-email")
    driver.find_element_by_css_selector("button[type='submit']").click()
    alert = driver.find_element_by_class_name("validation-alert")
    assert alert.is_displayed()
`
};

const SECTION_TABS: Record<string, string> = {
  about: "test_about.js",
  skills: "test_skills.py",
  projects: "saucedemo_cart.spec.js",
  writing: "medium_blog_tests.json",
  contact: "test_contact_form.py"
};

const getTimestamp = () => {
  const now = new Date();
  return now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
};

export function QATerminal({ activeSection = "about", isMobileDrawer = false, onCloseMobile }: { activeSection?: string; isMobileDrawer?: boolean; onCloseMobile?: () => void }) {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [loopCount, setLoopCount] = useState(1);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Sync logs and run automation loop when activeSection, isRunning, or loopCount changes
  useEffect(() => {
    if (!isRunning) return;

    const normalizedSection = SECTION_LOGS[activeSection] ? activeSection : "about";
    const sectionLogs = SECTION_LOGS[normalizedSection];
    let logIndex = 0;
    let timeouts: NodeJS.Timeout[] = [];

    // Print starting sequence header for the section
    setLogs(prev => {
      // Limit history size to prevent DOM bloat and scroll lag
      const history = prev.slice(-15);
      return [
        ...history,
        {
          timestamp: getTimestamp(),
          level: "INFO",
          text: `--- [RUN #${loopCount}] Loading test suite '${SECTION_TABS[normalizedSection]}' ---`,
        }
      ];
    });

    const printNextLog = () => {
      if (logIndex >= sectionLogs.length) {
        // Current section finished. Loop this section's tests slowly
        const loopTimer = setTimeout(() => {
          setLoopCount(prev => prev + 1); // trigger re-run of this section
        }, 5000);
        timeouts.push(loopTimer);
        return;
      }

      const nextEntry = sectionLogs[logIndex];
      const printingTimer = setTimeout(() => {
        setLogs(prev => {
          const history = prev.slice(-25); // cap history size to prevent lag
          return [
            ...history,
            {
              timestamp: getTimestamp(),
              level: nextEntry.level,
              text: nextEntry.text
            }
          ];
        });
        logIndex++;
        printNextLog();
      }, logIndex === 0 ? 300 : 700); // staggered printing for natural effect
      
      timeouts.push(printingTimer);
    };

    printNextLog();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [activeSection, isRunning, loopCount]);

  // Auto-scroll to the bottom of the console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const clearConsole = () => {
    setLogs([
      {
        timestamp: getTimestamp(),
        level: "INFO",
        text: "Console cleared. Test runner listener active.",
      }
    ]);
  };

  const getLogLevelColor = (level: LogLine["level"]) => {
    switch (level) {
      case "COMMAND":
        return "text-[#ff9e64] font-bold";
      case "SUCCESS":
        return "text-[#9ece6a] font-semibold";
      case "WARN":
        return "text-[#e0af68]";
      case "ERROR":
        return "text-[#f7768e] font-bold";
      case "INFO":
      default:
        return "text-[#7aa2f7]";
    }
  };

  const currentTab = SECTION_TABS[activeSection] || "test_about.js";
  const currentCode = SECTION_CODE[activeSection] || SECTION_CODE.about;

  return (
    <div className="flex h-full bg-[#1a1b26] text-[#a9b1d6] font-mono select-none overflow-hidden text-xs md:text-sm border-t border-[#24283b] shadow-2xl relative">
      {/* IDE Sidebar - File Explorer (Hidden on narrow mobile view) */}
      <div className="hidden md:flex flex-col w-[22%] border-r border-[#24283b] bg-[#16161e] shrink-0 text-[11px]">
        <div className="p-3 uppercase text-xs font-bold tracking-wider text-[#565f89] border-b border-[#24283b]">
          Explorer
        </div>
        <div className="p-3 space-y-2.5 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-[#565f89]">
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <FolderClosed className="w-3.5 h-3.5 shrink-0" />
            <span>tests/</span>
          </div>
          {Object.entries(SECTION_TABS).map(([section, tabName]) => (
            <div 
              key={section} 
              className={`flex items-center gap-1.5 pl-4 py-1 px-2 rounded transition-colors ${
                activeSection === section 
                  ? "text-emerald-400 font-semibold bg-[#24283b] shadow-sm" 
                  : "text-[#565f89] hover:text-[#a9b1d6]"
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 shrink-0 ${activeSection === section ? "text-[#9ece6a]" : "text-[#565f89]"}`} />
              <span className="truncate">{tabName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* IDE Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Editor Tab Bar */}
        <div className="flex items-center justify-between px-4 bg-[#16161e] border-b border-[#24283b] z-10 shrink-0">
          <div className="flex items-center gap-2">
            {/* macOS controls */}
            <div className="flex gap-1.5 mr-2">
              <span 
                onClick={onCloseMobile}
                className="w-3 h-3 rounded-full bg-[#f7768e]/80 hover:bg-[#f7768e] transition-colors cursor-pointer flex items-center justify-center"
              >
                {isMobileDrawer && <X className="w-2 h-2 text-[#1a1b26]" />}
              </span>
              <span className="w-3 h-3 rounded-full bg-[#e0af68]/80" />
              <span className="w-3 h-3 rounded-full bg-[#9ece6a]/80" />
            </div>
            
            {/* Active Tab */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1b26] border-t-2 border-[#9ece6a] border-x border-[#24283b] text-white text-[11px] font-semibold">
              <FileCode className="w-3.5 h-3.5 text-[#9ece6a]" />
              <span>{currentTab}</span>
            </div>
          </div>

          {/* IDE Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`p-1 rounded hover:bg-[#24283b] transition-colors ${isRunning ? "text-[#9ece6a]" : "text-muted-foreground"}`}
              title={isRunning ? "Pause Automation Suite" : "Run Automation Suite"}
            >
              {isRunning ? <Square className="w-3.5 h-3.5 fill-[#9ece6a]" /> : <Play className="w-3.5 h-3.5 fill-[#a9b1d6]" />}
            </button>
            <button 
              onClick={clearConsole}
              className="p-1 rounded hover:bg-[#24283b] text-[#7aa2f7] transition-colors"
              title="Clear Console Output"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {isMobileDrawer && (
              <button 
                onClick={onCloseMobile}
                className="p-1 rounded hover:bg-[#24283b] text-[#f7768e] transition-colors md:hidden"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Editor Body - Split into Code View (35%) and Console Output (65%) */}
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Editor Code Snippet (Hidden on mobile to optimize space) */}
          <div className="hidden md:block h-[35%] bg-[#1a1b26] border-b border-[#24283b] overflow-y-auto p-3 text-[11px] text-[#565f89] scrollbar-none font-mono relative">
            <div className="absolute top-1 right-2 text-[9px] uppercase font-bold text-[#565f89]/50 select-none">
              ReadOnly Code Panel
            </div>
            <pre className="leading-tight select-text text-[#89ddff]">{currentCode}</pre>
          </div>

          {/* Test Runner Output Log */}
          <div className="flex-1 bg-[#15161e] p-4 overflow-y-auto space-y-1.5 scroll-smooth font-mono text-[11px] sm:text-xs relative">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(21,22,30,0.96),rgba(21,22,30,0.96)),repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)] pointer-events-none" />
            <div className="absolute top-1.5 right-3 text-[9px] uppercase font-bold text-[#565f89]/60 select-none flex items-center gap-1">
              <TerminalSquare className="w-3.5 h-3.5" />
              <span>Runner Output</span>
            </div>

            {/* Simulated Live Console Logs */}
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 relative z-10 leading-relaxed font-mono">
                <span className="text-[#565f89] select-none shrink-0 font-light text-[10px]">
                  [{log.timestamp}]
                </span>
                <span className={`shrink-0 font-bold ${getLogLevelColor(log.level)}`}>
                  {log.level === "COMMAND" ? "$" : `[${log.level}]`}
                </span>
                <span className={`break-all ${log.level === "COMMAND" ? "text-white" : "text-[#c0caf5]"}`}>
                  {log.text}
                </span>
              </div>
            ))}
            
            {isRunning && (
              <div className="flex items-center gap-1.5 text-xs text-[#7aa2f7] pl-1 relative z-10 font-bold">
                <span className="w-1.5 h-1.5 bg-[#7aa2f7] rounded-full animate-ping" />
                <span className="font-handwritten text-[10px] animate-pulse">Running test runner engine...</span>
              </div>
            )}

            <div ref={consoleEndRef} />
          </div>

        </div>

        {/* IDE Status Bar */}
        <div className="px-4 py-1 bg-[#16161e] border-t border-[#24283b] text-[#565f89] text-[10px] flex items-center justify-between select-none shrink-0 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-[#9ece6a] animate-pulse" : "bg-[#f7768e]"}`} />
              <span>STATUS: {isRunning ? "EXECUTING RUNNER" : "PAUSED"}</span>
            </span>
            <span>|</span>
            <span>RUN #: <strong className="text-[#e0af68]">{loopCount}</strong></span>
          </div>
          <div>
            <span>active tab: {currentTab}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

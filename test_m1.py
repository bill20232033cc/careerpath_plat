#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import sys

def test_careerpath():
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print("=" * 60)
        print("Testing CareerPath Platform")
        print("=" * 60)

        # Test 1: Homepage
        print("\n[1/4] Testing Homepage...")
        try:
            page.goto("http://localhost:3000", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Check title
            title = page.title()
            assert "CareerPath" in title, f"Title mismatch: {title}"
            print(f"   ✓ Title: {title}")

            # Check hero section
            hero = page.locator("text=开启你的")
            assert hero.is_visible(), "Hero section not visible"
            print("   ✓ Hero section visible")

            # Check CTA button
            cta = page.locator("text=立即开始")
            assert cta.is_visible(), "CTA button not visible"
            print("   ✓ CTA button visible")

            # Check features
            features = page.locator("text=核心功能")
            assert features.is_visible(), "Features section not visible"
            print("   ✓ Features section visible")

        except Exception as e:
            errors.append(f"Homepage: {str(e)}")
            print(f"   ✗ Error: {e}")

        # Test 2: Login Page
        print("\n[2/4] Testing Login Page...")
        try:
            page.goto("http://localhost:3000/login", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Check login form
            email_input = page.locator('input[type="email"]')
            assert email_input.is_visible(), "Email input not visible"
            print("   ✓ Email input visible")

            password_input = page.locator('input[type="password"]')
            assert password_input.is_visible(), "Password input not visible"
            print("   ✓ Password input visible")

            submit_btn = page.locator("button:has-text('登录')")
            assert submit_btn.is_visible(), "Submit button not visible"
            print("   ✓ Submit button visible")

            # Check register link
            register_link = page.locator('text=立即注册')
            assert register_link.is_visible(), "Register link not visible"
            print("   ✓ Register link visible")

        except Exception as e:
            errors.append(f"Login: {str(e)}")
            print(f"   ✗ Error: {e}")

        # Test 3: Register Page
        print("\n[3/4] Testing Register Page...")
        try:
            page.goto("http://localhost:3000/register", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Check register form
            username_input = page.locator('input[placeholder="输入用户名"]')
            assert username_input.is_visible(), "Username input not visible"
            print("   ✓ Username input visible")

            email_input = page.locator('input[type="email"]')
            assert email_input.is_visible(), "Email input not visible"
            print("   ✓ Email input visible")

            password_input = page.locator('input[type="password"]')
            assert password_input.is_visible(), "Password input not visible"
            print("   ✓ Password input visible")

            submit_btn = page.locator("button:has-text('注册')")
            assert submit_btn.is_visible(), "Submit button not visible"
            print("   ✓ Submit button visible")

        except Exception as e:
            errors.append(f"Register: {str(e)}")
            print(f"   ✗ Error: {e}")

        # Test 4: Dashboard Page
        print("\n[4/4] Testing Dashboard Page...")
        try:
            page.goto("http://localhost:3000/dashboard", wait_until="networkidle")
            page.wait_for_timeout(1000)

            # Check welcome message
            welcome = page.locator("text=欢迎回来")
            assert welcome.is_visible(), "Welcome message not visible"
            print("   ✓ Welcome message visible")

            # Check navigation
            nav_resume = page.locator('text=简历')
            assert nav_resume.is_visible(), "Resume nav not visible"
            print("   ✓ Navigation visible")

            # Check quick actions
            quick_actions = page.locator("text=简历分析")
            assert quick_actions.count() > 0, "Quick actions not visible"
            print("   ✓ Quick actions visible")

        except Exception as e:
            errors.append(f"Dashboard: {str(e)}")
            print(f"   ✗ Error: {e}")

        # Test 5: API - Register
        print("\n[5/6] Testing API - Register...")
        try:
            response = page.request.post(
                "http://localhost:3000/api/auth/register",
                headers={"Content-Type": "application/json"},
                data='{"email":"test@example.com","password":"test123","username":"testuser"}'
            )
            assert response.ok, f"Register API failed: {response.status}"
            print(f"   ✓ Register API: {response.status}")
        except Exception as e:
            errors.append(f"API Register: {str(e)}")
            print(f"   ✗ Error: {e}")

        # Test 6: API - Login
        print("\n[6/6] Testing API - Login...")
        try:
            response = page.request.post(
                "http://localhost:3000/api/auth/login",
                headers={"Content-Type": "application/json"},
                data='{"email":"test@example.com","password":"test123"}'
            )
            assert response.ok, f"Login API failed: {response.status}"
            print(f"   ✓ Login API: {response.status}")
        except Exception as e:
            errors.append(f"API Login: {str(e)}")
            print(f"   ✗ Error: {e}")

        browser.close()

        # Summary
        print("\n" + "=" * 60)
        print("Test Summary")
        print("=" * 60)

        if console_errors:
            print(f"\n⚠️  Console Errors ({len(console_errors)}):")
            for err in console_errors[:5]:
                print(f"   - {err[:100]}")

        if errors:
            print(f"\n✗ Failed Tests ({len(errors)}):")
            for err in errors:
                print(f"   - {err}")
            return 1
        else:
            print("\n✓ All tests passed!")
            return 0

if __name__ == "__main__":
    sys.exit(test_careerpath())

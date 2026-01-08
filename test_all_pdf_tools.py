#!/usr/bin/env python3
"""Comprehensive test script for all PDF tools"""

import requests
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import time

def create_test_pdf():
    """Create a simple test PDF file"""
    filename = "test_sample.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, "PixelCraft PDF Tools Test Document")
    c.drawString(100, 730, "This document is used to test all PDF processing features.")
    c.drawString(100, 710, "Line 3: Testing text extraction and conversion.")
    c.drawString(100, 690, "Line 4: PDF to Word, Excel, PowerPoint conversion test.")
    c.drawString(100, 670, "Line 5: OCR, rotation, compression, and protection test.")
    c.showPage()
    c.save()
    return filename

def test_server_health():
    """Test if server is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running and healthy")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Server is not responding: {e}")
        return False

def test_pdf_endpoints():
    """Test all PDF endpoints"""
    if not test_server_health():
        return False
    
    # Create test PDF
    pdf_file = create_test_pdf()
    print(f"📄 Created test PDF: {pdf_file}")
    
    base_url = "http://localhost:8000"
    
    # List of endpoints to test (using /pdf/ prefix as shown in server output)
    test_cases = [
        {
            "endpoint": "/pdf/to-word",
            "name": "PDF to Word",
            "data": {},
            "expected_content_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        },
        {
            "endpoint": "/pdf/to-images", 
            "name": "PDF to Images",
            "data": {"format": "png", "dpi": "150"},
            "expected_content_type": "application/zip"
        },
        {
            "endpoint": "/pdf/extract-text",
            "name": "Text Extraction",
            "data": {},
            "expected_content_type": "application/json"
        },
        {
            "endpoint": "/pdf/merge",
            "name": "PDF Merge",
            "data": {},
            "expected_content_type": "application/pdf",
            "multiple_files": True
        },
        {
            "endpoint": "/pdf/split",
            "name": "PDF Split",
            "data": {"pages_per_file": "1"},
            "expected_content_type": "application/zip"
        },
        {
            "endpoint": "/pdf/compress",
            "name": "PDF Compression",
            "data": {"quality": "50"},
            "expected_content_type": "application/pdf"
        }
    ]
    
    results = []
    
    for test_case in test_cases:
        print(f"\n🧪 Testing {test_case['name']}...")
        
        try:
            # Handle multiple files for merge endpoint
            if test_case.get('multiple_files'):
                with open(pdf_file, 'rb') as f1, open(pdf_file, 'rb') as f2:
                    files = [('files', f1), ('files', f2)]
                    data = test_case['data']
                    
                    response = requests.post(
                        f"{base_url}{test_case['endpoint']}", 
                        files=files, 
                        data=data,
                        timeout=30
                    )
            else:
                with open(pdf_file, 'rb') as f:
                    files = {'file': f}
                    data = test_case['data']
                    
                    response = requests.post(
                        f"{base_url}{test_case['endpoint']}", 
                        files=files, 
                        data=data,
                        timeout=30
                    )
                
                if response.status_code == 200:
                    content_type = response.headers.get('content-type', '').lower()
                    expected_type = test_case['expected_content_type'].lower()
                    
                    if expected_type in content_type:
                        print(f"✅ {test_case['name']} - SUCCESS")
                        
                        # For JSON responses, show some data
                        if 'json' in content_type:
                            try:
                                json_data = response.json()
                                if isinstance(json_data, dict):
                                    for key, value in list(json_data.items())[:3]:
                                        if isinstance(value, str) and len(value) > 100:
                                            print(f"   {key}: {value[:50]}...")
                                        else:
                                            print(f"   {key}: {value}")
                            except:
                                pass
                        else:
                            print(f"   Response size: {len(response.content)} bytes")
                            
                        results.append({"name": test_case['name'], "status": "SUCCESS"})
                    else:
                        print(f"⚠️ {test_case['name']} - Wrong content type: {content_type}")
                        results.append({"name": test_case['name'], "status": "WRONG_TYPE"})
                else:
                    try:
                        error_data = response.json()
                        error_msg = error_data.get('detail', 'Unknown error')
                    except:
                        error_msg = response.text[:100]
                    
                    print(f"❌ {test_case['name']} - FAILED (Status: {response.status_code})")
                    print(f"   Error: {error_msg}")
                    results.append({"name": test_case['name'], "status": "FAILED", "error": error_msg})
                    
        except Exception as e:
            print(f"❌ {test_case['name']} - ERROR: {str(e)}")
            results.append({"name": test_case['name'], "status": "ERROR", "error": str(e)})
    
    # Clean up
    if os.path.exists(pdf_file):
        os.remove(pdf_file)
        print(f"\n🧹 Cleaned up test file: {pdf_file}")
    
    # Summary
    print(f"\n📊 TEST SUMMARY:")
    success_count = sum(1 for r in results if r['status'] == 'SUCCESS')
    total_count = len(results)
    
    print(f"✅ Successful: {success_count}/{total_count}")
    
    if success_count < total_count:
        print(f"❌ Failed: {total_count - success_count}")
        print("\nFailed tests:")
        for result in results:
            if result['status'] != 'SUCCESS':
                print(f"  - {result['name']}: {result['status']}")
    
    return success_count == total_count

if __name__ == "__main__":
    print("🚀 Starting comprehensive PDF tools test...")
    success = test_pdf_endpoints()
    
    if success:
        print("\n🎉 ALL PDF TOOLS ARE WORKING CORRECTLY!")
    else:
        print("\n⚠️ Some PDF tools need attention. Check the errors above.")

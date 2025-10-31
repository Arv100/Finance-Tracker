# Add this to a new file: Backend/categorization.py

import re
from typing import Tuple, Optional

# Keyword-based categorization rules
CATEGORY_KEYWORDS = {
    # Food & Dining
    "Food & Dining": [
        "restaurant", "cafe", "coffee", "starbucks", "mcdonald", "burger",
        "pizza", "food", "dining", "lunch", "dinner", "breakfast", "eatery",
        "bistro", "grill", "kitchen", "bar", "pub", "diner", "fast food"
    ],
    "Groceries": [
        "grocery", "supermarket", "walmart", "target", "costco", "whole foods",
        "trader joe", "safeway", "kroger", "publix", "market", "food store",
        "aldi", "lidl", "fresh", "organic"
    ],
    
    # Housing
    "Housing": [
        "furniture", "home depot", "ikea", "bed bath", "lowes", "hardware",
        "home improvement", "decor", "furnishing"
    ],
    "Rent/Mortgage": [
        "rent", "mortgage", "lease", "housing payment", "property management",
        "landlord", "rental"
    ],
    "Utilities": [
        "electric", "electricity", "water", "gas utility", "power", "energy",
        "utility", "sewage", "trash", "waste management", "internet", "wifi",
        "broadband", "comcast", "verizon", "at&t", "spectrum"
    ],
    
    # Transportation
    "Transportation": [
        "uber", "lyft", "taxi", "cab", "rideshare", "car rental", "hertz",
        "enterprise", "parking", "toll", "metro", "subway"
    ],
    "Gas/Fuel": [
        "gas station", "fuel", "shell", "chevron", "exxon", "bp", "mobil",
        "petrol", "gasoline", "diesel"
    ],
    "Public Transport": [
        "bus", "train", "metro", "subway", "transit", "railway", "amtrak",
        "public transport", "mta", "bart"
    ],
    
    # Healthcare
    "Healthcare": [
        "hospital", "clinic", "doctor", "medical", "health", "pharmacy",
        "cvs", "walgreens", "prescription", "medicine", "dental", "dentist",
        "physician", "healthcare", "urgent care", "emergency"
    ],
    "Insurance": [
        "insurance", "premium", "policy", "coverage", "geico", "state farm",
        "allstate", "progressive", "health insurance", "life insurance"
    ],
    
    # Entertainment
    "Entertainment": [
        "netflix", "hulu", "disney", "spotify", "apple music", "amazon prime",
        "movie", "cinema", "theater", "theatre", "concert", "show", "game",
        "entertainment", "amusement", "fun", "recreation", "steam", "playstation",
        "xbox", "nintendo"
    ],
    
    # Shopping
    "Shopping": [
        "amazon", "ebay", "shop", "store", "retail", "purchase", "buy",
        "shopping", "mall", "outlet", "online"
    ],
    "Clothing": [
        "clothing", "apparel", "fashion", "nike", "adidas", "h&m", "zara",
        "gap", "uniqlo", "shoes", "shirt", "pants", "dress", "suit"
    ],
    "Personal Care": [
        "salon", "spa", "barber", "haircut", "beauty", "cosmetic", "makeup",
        "skincare", "massage", "manicure", "pedicure", "grooming"
    ],
    
    # Education
    "Education": [
        "school", "university", "college", "tuition", "course", "class",
        "education", "learning", "training", "books", "textbook", "academic",
        "udemy", "coursera", "edx"
    ],
    
    # Travel
    "Travel": [
        "hotel", "motel", "airbnb", "booking", "flight", "airline", "airport",
        "travel", "vacation", "trip", "resort", "accommodation", "hilton",
        "marriott", "expedia", "delta", "united", "american airlines"
    ],
    
    # Subscriptions
    "Subscriptions": [
        "subscription", "monthly", "membership", "gym", "fitness", "planet fitness",
        "24 hour fitness", "la fitness", "crunch", "yoga", "peloton"
    ],
    
    # Other Expense Categories
    "Gifts & Donations": [
        "gift", "donation", "charity", "nonprofit", "fundraiser", "contribution",
        "present", "flowers", "red cross", "salvation army"
    ],
    "Fees & Charges": [
        "fee", "charge", "atm", "bank fee", "service charge", "processing fee",
        "late fee", "overdraft", "penalty"
    ],
    "Taxes": [
        "tax", "irs", "federal tax", "state tax", "property tax", "income tax",
        "sales tax", "customs", "duty"
    ],
    
    # Income Categories
    "Salary": [
        "salary", "payroll", "wages", "paycheck", "employer", "payment from",
        "income", "earnings", "compensation"
    ],
    "Freelance": [
        "freelance", "consulting", "contractor", "upwork", "fiverr", "project payment",
        "client payment", "invoice"
    ],
    "Business": [
        "business income", "sales", "revenue", "customer payment", "service fee"
    ],
    "Investment": [
        "dividend", "stock", "investment", "capital gain", "portfolio",
        "trading", "etrade", "robinhood", "fidelity", "vanguard", "schwab"
    ],
    "Rental Income": [
        "rental income", "rent received", "property income", "tenant payment"
    ],
    "Interest": [
        "interest", "savings interest", "bank interest", "apy", "yield"
    ],
    "Bonus": [
        "bonus", "incentive", "commission", "performance pay", "reward"
    ],
    "Refund": [
        "refund", "reimbursement", "credit", "return", "cashback", "rebate"
    ],
}


def auto_categorize_transaction(
    description: str,
    amount: float,
    merchant: Optional[str] = None
) -> Tuple[str, str, float]:
    """
    Automatically categorize a transaction based on description and amount.
    
    Args:
        description: Transaction description
        amount: Transaction amount
        merchant: Optional merchant name
        
    Returns:
        Tuple of (category, transaction_type, confidence_score)
    """
    # Combine description and merchant for better matching
    search_text = f"{description} {merchant or ''}".lower()
    
    # Store matches with confidence scores
    matches = {}
    
    # Check each category's keywords
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword.lower() in search_text:
                # Longer keyword matches get higher scores
                score += len(keyword) * 2
                # Exact word match gets bonus
                if re.search(rf'\b{re.escape(keyword)}\b', search_text):
                    score += 10
        
        if score > 0:
            matches[category] = score
    
    # Determine transaction type based on amount or category
    transaction_type = "expense" if amount >= 0 else "income"
    
    # Income category keywords indicate income regardless of amount
    income_categories = ["Salary", "Freelance", "Business", "Investment", 
                        "Rental Income", "Interest", "Bonus", "Refund"]
    
    if matches:
        # Get category with highest confidence
        best_category = max(matches, key=matches.get)
        confidence = min(matches[best_category] / 30.0, 1.0)  # Normalize to 0-1
        
        # Override transaction type if it's an income category
        if best_category in income_categories:
            transaction_type = "income"
            
        return best_category, transaction_type, confidence
    
    # Default categories if no match found
    if transaction_type == "income":
        return "Other Income", "income", 0.0
    else:
        return "Other Expense", "expense", 0.0


def bulk_categorize_transactions(transactions_data: list) -> list:
    """
    Categorize a list of transactions.
    
    Args:
        transactions_data: List of transaction dictionaries with 'description', 'amount', 'merchant'
        
    Returns:
        List of transactions with added 'category', 'type', and 'confidence' fields
    """
    categorized = []
    
    for txn in transactions_data:
        description = txn.get("description", "")
        amount = abs(float(txn.get("amount", 0)))
        merchant = txn.get("merchant", txn.get("account", ""))
        
        category, txn_type, confidence = auto_categorize_transaction(
            description, amount, merchant
        )
        
        categorized.append({
            **txn,
            "suggested_category": category,
            "suggested_type": txn_type,
            "confidence": round(confidence, 2),
            "needs_review": confidence < 0.5  # Flag low confidence for manual review
        })
    
    return categorized


def get_category_suggestions(description: str) -> list:
    """
    Get top 3 category suggestions for a given description.
    
    Args:
        description: Transaction description
        
    Returns:
        List of tuples (category, confidence_score)
    """
    matches = {}
    search_text = description.lower()
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword.lower() in search_text:
                score += len(keyword) * 2
                if re.search(rf'\b{re.escape(keyword)}\b', search_text):
                    score += 10
        
        if score > 0:
            matches[category] = min(score / 30.0, 1.0)
    
    # Sort by confidence and return top 3
    sorted_matches = sorted(matches.items(), key=lambda x: x[1], reverse=True)
    return sorted_matches[:3]
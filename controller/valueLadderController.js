const axios = require("axios");
const ValueLadder = require("../models/valueLadder");

// Generate GPT-based response and save
const generateValueLadder = async (req, res) => {
  const { qaPairs } = req.body;
  const email = "ai.studio.projects@gmail.com"; // You can replace with dynamic email if needed
console.log(qaPairs)

  try {
    // Format QA for GPT
    const formattedQA = qaPairs.map((pair, index) =>
      `Q${index + 1}: ${pair.question}\nA${index + 1}: ${pair.answer}`
    ).join('\n\n');

    const prompt = [
      {
        role: "system",
        content: `You're a marketing strategist. Format response in markdown with proper line breaks and headers.
        Using the student's answers to the questions provided, create a tailored response that includes the following outputs in this structure:


Business Model
Business Type: [B2C or B2B]
Target Market: [Brief description of ideal client]
Your Five-Tier Value Ladder
Tier 1: Free Offer
Offer Name: "[AI-generated name based on student's field]"
Offer Type: [presentation/ebook/template/webinar/call/etc.]
Transformation Provided: "[AI-generated transformation statement]"
Purpose: Database building and initial relationship establishment
Tier 2: Small Offer (Entry-Level)
Offer Name: "[AI-generated name based on student's field]"
Price Point: [Under $500 for B2C or under $5,000 for B2B]
Offer Type: [workshop/online course/product/etc.]
Transformation Provided: "[AI-generated transformation statement]"
Purpose: Convert free leads into paying customers
Tier 3: Mid-Ticket Offer
Offer Name: "[AI-generated name based on student's field]"
Price Point: [$500-$2,000 for B2C or $5,000-$20,000 for B2B]
Offer Type: [group coaching/retreat/service package/etc.]
Transformation Provided: "[AI-generated transformation statement]"
Tier 4: Main Offer
Offer Name: "[AI-generated name based on student's field]"
Price Point: [$2,000-$10,000 for B2C or $20,000-$100,000 for B2B]
Offer Type: [premium program/service/package/etc.]
Transformation Provided: "[AI-generated transformation statement]"
Tier 5: Premium Package
Offer Name: "[AI-generated name based on student's field]"
Price Point: [$10,000+ for B2C or $100,000+ for B2B]
Offer Type: [mastermind/one-on-one/done-for-you/etc.]
Transformation Provided: "[AI-generated transformation statement]"
Customer Journey Design
Journey Model: [Which model works best for your business]
Psychological Progression:
From Free to Paid: "[AI-generated psychological shift description]"
From Small to Mid-Ticket: "[AI-generated psychological shift description]"
From Mid-Ticket to Main Offer: "[AI-generated psychological shift description]"
From Main to Premium: "[AI-generated psychological shift description]"
Offer Elements
System: Your methodology that makes the offer credible
Social Proof: Testimonials or credentials
Value Connection: How your offers connect to client values
Unique Opportunities: Special inclusions to make offers irresistible
Implementation Priority
Starting Point: [Based on business stage - typically one-on-one → group → products]
First Three Offers to Create: [Recommendations based on current situation]`
      },
      {
        role: "user",
        content: `Here are my questions and answers: ${formattedQA}`
      }
    ];

    console.log(prompt)

    // Call GPT API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: prompt,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const gptContent = response.data.choices[0].message.content;

    // Upsert user data
    const updatedDoc = await ValueLadder.findOneAndUpdate(
      { email },
      {
        qaPairs,
        gptResponse: gptContent,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ answer: gptContent });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate audience insight" });
  }
};

// Fetch user data
const getUserData = async (req, res) => {
  const { email } = req.params;

  try {
    const userData = await ValueLadder.findOne({ email });
    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ message: "User data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

// Delete user data
const deleteUserData = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await ValueLadder.deleteOne({ email: email });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "User data deleted successfully" });
    } else {
      res.status(404).json({ message: "User data not found" });
    }
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ error: "Failed to delete user data" });
  }
};

module.exports = { generateValueLadder, getUserData, deleteUserData };

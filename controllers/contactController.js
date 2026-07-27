const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// Create Contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification to muralidharan18898@gmail.com
    try {
      await sendEmail({
        to: "muralidharan18898@gmail.com",
        subject: `New Support Query: ${contact.subject}`,
        text: `You have received a new support inquiry.\n\nSender: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}\n\nReview this in the Admin Dashboard.`,
        html: `
          <h3>New Support Inquiry Received</h3>
          <p><strong>Sender Name:</strong> ${contact.name}</p>
          <p><strong>Email Address:</strong> ${contact.email}</p>
          <p><strong>Subject:</strong> ${contact.subject}</p>
          <p><strong>Message Inquiry:</strong></p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin-left: 0; color: #555;">
            ${(contact.message || "").replace(/\n/g, "<br>")}
          </blockquote>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #888;">This email was sent automatically from your Admin Portal.</p>
        `,
      });
    } catch (mailErr) {
      console.error("Email notification failed to send:", mailErr);
    }

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
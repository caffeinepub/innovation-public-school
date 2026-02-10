import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ContentSection = {
    id : Text;
    title : Text;
    body : Text;
    isPublished : Bool;
  };

  module ContentSection {
    public func compareByTitle(section1 : ContentSection, section2 : ContentSection) : Order.Order {
      Text.compare(section1.title, section2.title);
    };
  };

  type GalleryItem = {
    id : Text;
    title : Text;
    category : Text;
    image : Storage.ExternalBlob;
    isActive : Bool;
  };

  module GalleryItem {
    public func compareByTitle(item1 : GalleryItem, item2 : GalleryItem) : Order.Order {
      Text.compare(item1.title, item2.title);
    };

    public func compareByCategory(item1 : GalleryItem, item2 : GalleryItem) : Order.Order {
      switch (Text.compare(item1.category, item2.category)) {
        case (#equal) { Text.compare(item1.title, item2.title) };
        case (order) { order };
      };
    };
  };

  type Enquiry = {
    id : Text;
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    enquiryType : Text;
    submittedAt : Time.Time;
    isRead : Bool;
  };

  type ContactDetails = {
    address : Text;
    phone : Text;
    email : Text;
    mapEmbed : Text;
    displayMap : Bool;
  };

  type UserProfile = {
    name : Text;
  };

  // Persistent state
  var contentSections = Map.empty<Text, ContentSection>();
  let galleryItems = Map.empty<Text, GalleryItem>();
  let enquiries = Map.empty<Text, Enquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var contactDetails : ?ContactDetails = ?{
    address = "B-80, South Extension – II, New Delhi- 110049";
    phone = "+91 98115 14808";
    email = "admissioninfo@innovationedu.in";
    mapEmbed = "https://maps.google.com/?q=Delhi";
    displayMap = true;
  };

  // User Profile Operations
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type AdminUser = {
    username : Text;
    password : Text;
  };

  // Backend Admin User
  let adminUser : AdminUser = {
    username = "innovationpublicschools";
    password = "innovation123publicschools";
  };

  // Admin session tracking - independent from AccessControl role system
  let adminSessions = Map.empty<Principal, Bool>();

  // Helper function to check if caller has valid admin session
  func isAdminSession(caller : Principal) : Bool {
    switch (adminSessions.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  // #########################################################################
  // #                   Admin Authentication API                            #
  // #########################################################################

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Text {
    // Login endpoint must be publicly accessible - no authorization check needed
    // This allows anonymous principals to authenticate as admin
    if (username != adminUser.username or password != adminUser.password) {
      Runtime.trap("Invalid username or password");
    };

    // Create admin session for this caller
    adminSessions.add(caller, true);

    "authenticated";
  };

  public query ({ caller }) func validateAdminSession(token : Text) : async Bool {
    // Validation endpoint checks if caller has active admin session
    if (token != "authenticated") {
      return false;
    };
    isAdminSession(caller);
  };

  public shared ({ caller }) func adminLogout(token : Text) : async () {
    // Logout endpoint must be publicly accessible - no authorization check needed
    if (token != "authenticated") {
      Runtime.trap("Invalid token");
    };
    adminSessions.remove(caller);
  };

  // #########################################################################
  // #                   Content Section Operations                          #
  // #########################################################################

  public query ({ caller }) func getAllContentSections() : async [ContentSection] {
    // Public read access - no authorization check needed
    contentSections.values().toArray().sort(ContentSection.compareByTitle);
  };

  public query ({ caller }) func getContentSection(id : Text) : async ContentSection {
    // Public read access - no authorization check needed
    switch (contentSections.get(id)) {
      case (null) { Runtime.trap("Section not found") };
      case (?section) { section };
    };
  };

  public shared ({ caller }) func createContentSection(section : ContentSection) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can create content sections");
    };

    if (contentSections.get(section.id) != null) {
      Runtime.trap("Content section with this ID already exists");
    };

    contentSections.add(section.id, section);
  };

  public shared ({ caller }) func updateContentSection(id : Text, section : ContentSection) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can update content sections");
    };

    switch (contentSections.get(id)) {
      case (null) { Runtime.trap("Content section not found") };
      case (?_) {
        contentSections.add(id, section);
      };
    };
  };

  public shared ({ caller }) func deleteContentSection(id : Text) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete content sections");
    };

    switch (contentSections.get(id)) {
      case (null) { Runtime.trap("Content section not found") };
      case (?_) {
        contentSections.remove(id);
      };
    };
  };

  // #########################################################################
  // #                   Gallery Operations                                  #
  // #########################################################################

  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    // Public read access - no authorization check needed
    galleryItems.values().toArray().sort(GalleryItem.compareByTitle);
  };

  public query ({ caller }) func getGalleryItemsByCategory(category : Text) : async [GalleryItem] {
    // Public read access - no authorization check needed
    galleryItems.values().toArray().filter(func(item) { item.category == category }).sort(GalleryItem.compareByTitle);
  };

  public shared ({ caller }) func createGalleryItem(item : GalleryItem) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can create gallery items");
    };

    if (galleryItems.get(item.id) != null) {
      Runtime.trap("Gallery item with this ID already exists");
    };

    galleryItems.add(item.id, item);
  };

  public shared ({ caller }) func updateGalleryItem(id : Text, item : GalleryItem) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };

    switch (galleryItems.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?_) {
        galleryItems.add(id, item);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };

    switch (galleryItems.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?_) {
        galleryItems.remove(id);
      };
    };
  };

  // #########################################################################
  // #                   Enquiry Operations                                  #
  // #########################################################################

  public shared ({ caller }) func submitEnquiry(newEnquiry : Enquiry) : async () {
    // Public contact form - no authorization check needed
    enquiries.add(newEnquiry.id, newEnquiry);
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };

    enquiries.values().toArray();
  };

  public query ({ caller }) func getEnquiry(id : Text) : async Enquiry {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };

    switch (enquiries.get(id)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?enquiry) { enquiry };
    };
  };

  public shared ({ caller }) func markEnquiryAsRead(id : Text) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can mark enquiries as read");
    };

    switch (enquiries.get(id)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?enquiry) {
        let updatedEnquiry = {
          id = enquiry.id;
          name = enquiry.name;
          email = enquiry.email;
          subject = enquiry.subject;
          message = enquiry.message;
          enquiryType = enquiry.enquiryType;
          submittedAt = enquiry.submittedAt;
          isRead = true;
        };
        enquiries.add(id, updatedEnquiry);
      };
    };
  };

  public shared ({ caller }) func deleteEnquiry(id : Text) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can delete enquiries");
    };

    switch (enquiries.get(id)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?_) {
        enquiries.remove(id);
      };
    };
  };

  // #########################################################################
  // #                   Contact Details Operations                          #
  // #########################################################################

  public query ({ caller }) func getContactDetails() : async ContactDetails {
    // Public read access - no authorization check needed
    switch (contactDetails) {
      case (null) { Runtime.trap("Contact details not found") };
      case (?details) { details };
    };
  };

  public shared ({ caller }) func updateContactDetails(details : ContactDetails) : async () {
    if (not isAdminSession(caller)) {
      Runtime.trap("Unauthorized: Only admins can update contact details");
    };

    contactDetails := ?details;
  };
};

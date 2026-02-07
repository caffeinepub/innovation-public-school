import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

  public type UserProfile = {
    name : Text;
  };

  // Persistent state
  let contentSections = Map.empty<Text, ContentSection>();
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
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  // Content Section Operations
  public query ({ caller }) func getAllContentSections() : async [ContentSection] {
    contentSections.values().toArray().sort(ContentSection.compareByTitle);
  };

  public query ({ caller }) func getContentSection(id : Text) : async ContentSection {
    switch (contentSections.get(id)) {
      case (null) { Runtime.trap("Section not found") };
      case (?section) { section };
    };
  };

  public shared ({ caller }) func createContentSection(section : ContentSection) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create content sections");
    };
    contentSections.add(section.id, section);
  };

  public shared ({ caller }) func updateContentSection(id : Text, newTitle : Text, newBody : Text, isPublished : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content sections");
    };
    switch (contentSections.get(id)) {
      case (null) { Runtime.trap("Section not found") };
      case (?_) {
        let updatedSection : ContentSection = {
          id;
          title = newTitle;
          body = newBody;
          isPublished;
        };
        contentSections.add(id, updatedSection);
      };
    };
  };

  public shared ({ caller }) func deleteContentSection(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete content sections");
    };
    contentSections.remove(id);
  };

  // Gallery Operations
  public query ({ caller }) func getAllGalleryItems() : async [GalleryItem] {
    galleryItems.values().toArray().sort(GalleryItem.compareByTitle);
  };

  public query ({ caller }) func getGalleryItemsByCategory(category : Text) : async [GalleryItem] {
    galleryItems.values().toArray().filter(func(item) { item.category == category }).sort(GalleryItem.compareByTitle);
  };

  public shared ({ caller }) func createGalleryItem(item : GalleryItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create gallery items");
    };
    galleryItems.add(item.id, item);
  };

  public shared ({ caller }) func updateGalleryItem(id : Text, newTitle : Text, newCategory : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery items");
    };
    switch (galleryItems.get(id)) {
      case (null) { Runtime.trap("Gallery item not found") };
      case (?existingItem) {
        let updatedItem : GalleryItem = {
          id;
          title = newTitle;
          category = newCategory;
          image = existingItem.image;
          isActive;
        };
        galleryItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteGalleryItem(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery items");
    };
    galleryItems.remove(id);
  };

  // Enquiry Operations
  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };
    enquiries.values().toArray();
  };

  public shared ({ caller }) func submitEnquiry(newEnquiry : Enquiry) : async () {
    enquiries.add(newEnquiry.id, newEnquiry);
  };

  public shared ({ caller }) func markEnquiryAsRead(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update enquiry status");
    };
    switch (enquiries.get(id)) {
      case (null) { Runtime.trap("Enquiry not found") };
      case (?_) {
        var updatedEnquiry = switch (enquiries.get(id)) {
          case (?enquiry) { enquiry };
          case (null) { Runtime.trap("Enquiry not found") };
        };
        updatedEnquiry := {
          id = updatedEnquiry.id;
          name = updatedEnquiry.name;
          email = updatedEnquiry.email;
          subject = updatedEnquiry.subject;
          message = updatedEnquiry.message;
          enquiryType = updatedEnquiry.enquiryType;
          submittedAt = updatedEnquiry.submittedAt;
          isRead = true;
        };
        enquiries.add(id, updatedEnquiry);
      };
    };
  };

  public shared ({ caller }) func deleteEnquiry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete enquiries");
    };
    enquiries.remove(id);
  };

  // Contact Details
  public query ({ caller }) func getContactDetails() : async ContactDetails {
    switch (contactDetails) {
      case (null) { Runtime.trap("Contact details not found") };
      case (?details) { details };
    };
  };

  public shared ({ caller }) func updateContactDetails(newDetails : ContactDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact details");
    };
    contactDetails := ?newDetails;
  };

  public shared ({ caller }) func updateMapEmbed(mapLink : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update map embed");
    };
    switch (contactDetails) {
      case (null) { Runtime.trap("Contact details not found") };
      case (?currentDetails) {
        let updatedDetails : ContactDetails = {
          address = currentDetails.address;
          phone = currentDetails.phone;
          email = currentDetails.email;
          mapEmbed = mapLink;
          displayMap = currentDetails.displayMap;
        };
        contactDetails := ?updatedDetails;
      };
    };
  };

  public shared ({ caller }) func toggleMapDisplay() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle map display");
    };
    switch (contactDetails) {
      case (null) { Runtime.trap("Contact details not found") };
      case (?currentDetails) {
        let updatedDetails : ContactDetails = {
          address = currentDetails.address;
          phone = currentDetails.phone;
          email = currentDetails.email;
          mapEmbed = currentDetails.mapEmbed;
          displayMap = not currentDetails.displayMap;
        };
        contactDetails := ?updatedDetails;
      };
    };
  };
};

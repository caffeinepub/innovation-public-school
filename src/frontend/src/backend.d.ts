import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContentSection {
    id: string;
    title: string;
    isPublished: boolean;
    body: string;
}
export type Time = bigint;
export interface ContactDetails {
    email: string;
    address: string;
    phone: string;
    displayMap: boolean;
    mapEmbed: string;
}
export interface GalleryItem {
    id: string;
    title: string;
    isActive: boolean;
    category: string;
    image: ExternalBlob;
}
export interface Enquiry {
    id: string;
    subject: string;
    enquiryType: string;
    name: string;
    submittedAt: Time;
    isRead: boolean;
    email: string;
    message: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminLogin(username: string, password: string): Promise<string>;
    adminLogout(token: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createContentSection(section: ContentSection): Promise<void>;
    createGalleryItem(item: GalleryItem): Promise<void>;
    deleteContentSection(id: string): Promise<void>;
    deleteEnquiry(id: string): Promise<void>;
    deleteGalleryItem(id: string): Promise<void>;
    getAllContentSections(): Promise<Array<ContentSection>>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getAllGalleryItems(): Promise<Array<GalleryItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactDetails(): Promise<ContactDetails>;
    getContentSection(id: string): Promise<ContentSection>;
    getEnquiry(id: string): Promise<Enquiry>;
    getGalleryItemsByCategory(category: string): Promise<Array<GalleryItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markEnquiryAsRead(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(newEnquiry: Enquiry): Promise<void>;
    updateContactDetails(details: ContactDetails): Promise<void>;
    updateContentSection(id: string, section: ContentSection): Promise<void>;
    updateGalleryItem(id: string, item: GalleryItem): Promise<void>;
    validateAdminSession(token: string): Promise<boolean>;
}

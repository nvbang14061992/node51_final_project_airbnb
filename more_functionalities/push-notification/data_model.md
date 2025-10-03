# 🧠 Explanation of Key Fields

| Column       | Purpose                                                            |
| ------------ | ------------------------------------------------------------------ |
| `id`         | Primary key                                                        |
| `bookingId`  | Link to a booking if this notification is about one                |
| `receiverId` | Host user who receives the notification                            |
| `type`       | Type of notification (enum is more efficient for known categories) |
| `title`      | Short summary/title for the notification                           |
| `message`    | Optional detail (e.g., booking info)                               |
| `isRead`     | Marks if user has seen this notification                           |
| `createdAt`  | Useful for ordering notifications                                  |
| `updatedAt`  | Useful for auditing or future editing                              |

## 📚 type ENUM Meaning

### 1. booking ✅

Meaning: A notification about a new room booking (P_room)

- Triggered by: A guest books a room via DatPhong
- Receiver: The host of that room
- Example title/message:
  - "New Booking Received"
  - "Your room has been booked from Oct 10 to Oct 12"
- Used For:
  - Booking notifications (your core case)
  - Link to the booking or calendar view
- UI Icon: 📅 or 🛏️

### 2. message 💬

Meaning: A user (usually guest) sent a message to the host (like Airbnb chat)

- Triggered by: Messaging system (future feature)
- Receiver: The host or guest
- Example title/message:
  - "New message from John"
  - "Hi, is early check-in available?"
- Used For:
  - Inbox or chat alerts
- UI Icon: 💬 or 📨

3. alert 🚨

Meaning: A general system alert or announcement

- Triggered by: Admin action, policy change, system status
- Receiver: Any user (host or guest)
- Example title/message:
  - "Room verification required"
  - "Your listing has been flagged for review"
- Used For:
  - Warnings, confirmations, or notices
  - Terms update, account issues, etc.
- UI Icon: ⚠️ or 🛑

# ✅ How This Maps to Your Current Structure

| Notification Table | Links to / Extracts from                                    |
| ------------------ | ----------------------------------------------------------- |
| `bookingId`        | FK to `DatPhong.id`                                         |
| `receiverId`       | Room host (you'll likely get this via `Phong.ma_chu_phong`) |
| `title/message`    | Set dynamically in your NotificationService                 |

# 🧱 API Goals

| Goal                               | Type                                   |
| ---------------------------------- | -------------------------------------- |
| Show badge with count of unread    | `GET /notifications/count`             |
| Fetch list of recent notifications | `GET /notifications`                   |
| Mark one or more as read           | `POST /notifications/mark-read`        |
| Optional: Delete a notification    | `DELETE /notifications/:id` (optional) |

# 📘 API Endpoints Design

## 1. GET /notifications/count

📌 Returns unread notification count for the logged-in user

- Auth required: ✅ Yes (JWT)
- Query params: (none)
- Response:

```json
{
  "count": 5
}
```

# 2. GET /notifications

📌 Returns a paginated list of notifications

- Auth required: ✅ Yes (JWT)
- Query params:
  | Param | Type | Default | Description |
  | -------- | ------- | ------- | ---------------------------------------- |
  | `page` | number | 1 | Page number |
  | `limit` | number | 10 | Number of items per page |
  | `unread` | boolean | false | Filter only unread if true |
  | `type` | string | - | Optional filter by type (`booking`, etc) |

- Response:

```json
{
  "page": 1,
  "totalPages": 2,
  "totalItems": 12,
  "data": [
    {
      "id": 123,
      "type": "booking",
      "title": "New Booking Received",
      "message": "Someone booked your room for Oct 5–6",
      "isRead": false,
      "createdAt": "2025-10-03T12:34:56.000Z"
    },
    ...
  ]
}
```

# 3. POST /notifications/mark-read

📌 Mark one or more notifications as read

- Auth required: ✅ Yes (JWT)
- Body:

```json
{
  "ids": [123, 124, 125]
}
```

- Response:

```json
{
  "updated": 3
}
```

# 4. DELETE /notifications/:id (Optional)

🧹 Removes a notification (logical delete or hard delete)

- Useful for user-managed cleanup
- May not be necessary unless UI allows dismissing notifications

# i18n (EN / VI) — tiến độ theo stage

## Stage 1 — Hoàn thành

- Cài `i18next`, `react-i18next`
- `tsconfig.app.json`: `resolveJsonModule: true`
- `src/i18n/index.ts` — khởi tạo, `fallbackLng: 'en'`, lưu ngôn ngữ vào `localStorage` (`i18nextLng`)
- `src/locales/en.json`, `src/locales/vi.json` — nhóm: `common`, `language`, `header`, `nav`, `layout`
- `src/main.tsx` — `import './i18n'`
- `src/components/LanguageSwitcher.tsx` — nút EN / VI trên header
- `Layout.tsx` — menu Profile / Logout dịch; truyền `extraActions`, `searchPlaceholder`, `createButtonText`
- `GlobalHeader.tsx` — tooltip, placeholder tìm kiếm, `extraActions`
- `NavigationSidebar.tsx` — Projects, Workflows, Admin, About

**Cách kiểm tra:** `npm install` (nếu chưa), `npm run dev`, đăng nhập, bật EN/VI và xem sidebar + header + menu user.

## Stage 3 — Hoàn thành

- `Home.tsx` — tiêu đề, nút tạo dự án, placeholder tìm kiếm, cột bảng, menu, empty state, dòng “Showing…”
- `About.tsx` — toàn bộ copy (tiêu đề, đoạn văn, 6 tính năng, Why / Get Started)
- `locales/en.json`, `vi.json` — nhóm `home`, `about`

## Stage 4 — Hoàn thành

- `Profile.tsx`, `EditProfileModal.tsx`, `users/UserDetail.tsx`, `NotFound.tsx`
- `locales` — nhóm `profile`, `editProfile`, `userDetail`, `notFound`; `common.cancel`

## Stage 5 — Hoàn thành

- `CreateProjectModal`, `EditProjectModal`, `DeleteProjectDialog` — toàn bộ form, validation, nút
- `ProjectDetail.tsx` — tab, bảng issue, board/sprint/team/activity UI có copy tĩnh, cột Kanban, dialog gỡ thành viên
- `locales` — `projects`, `projectDetail`; `common.cancel` / `common.save` (EN)

## Stage 6–10 — Hoàn thành (xem `docs/I18N.md`)

6. Issues & board (issue detail + modals)  
7. Workflows  
8. Sprints & labels  
9. Comments & attachments  
10. Team — `TeamList`, `AssignRoleModal`, dialog gỡ thành viên trên `ProjectDetail` (`key={i18n.language}`)

## Stage 11–13 — Hoàn thành

11. **Admin:** `AdminDashboard`, `UsersManagement`, `SystemSettingsManagement`, user/issue-type/priority/status modals, `DeleteUserDialog`; locale keys `adminPage`, `adminUsers`, `adminSettings`, `adminUserForm`, `adminDeleteUser`, `adminRefData`, `adminIssueTypeModal`, `adminPriorityModal`, `adminStatusModal`. Snackbar copy dùng `t()`; xóa cài đặt hệ thống vẫn `alert()` (stage 14).

12. **Notifications & Search:** `NotificationsDropdown` (`notificationsDropdown.*`, mốc thời gian dùng `projectDetail.relative*` + `projectDetail.invalidDate`). `SearchModal` (`searchModal.*`), `Dialog` có `key={i18n.language}`.

13. **Activity:** `ActivityFeed` — `formatTimestamp` dùng `projectDetail.relative*` / `invalidDate` và `dateLocale` theo ngôn ngữ. `EditLabelModal` fallback lỗi dùng `labelModal.updateFailed`.

## Stage tiếp theo (chưa làm)

14. Sagas / toast / centralized API error messages  

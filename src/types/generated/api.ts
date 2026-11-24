// Generated from the backend's openapi.json by scripts/api-types.mjs — do not edit.
// Document sha256 f6b1769a99069c83785ea70bb244e7d3a6eaa94e9b1ca5c6813aac654310a93f · backend f37bde18c7b09453901e327659bed702982fe776.
export interface paths {
    "/admin/agent-feedback/platform": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Platform Summary
         * @description Cross-org platform-wide feedback summary. Super Admin only.
         */
        get: operations["get_platform_summary_admin_agent_feedback_platform_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Platform Analytics
         * @description Platform-wide analytics for Teaky super admin.
         */
        get: operations["get_platform_analytics_admin_analytics_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Members
         * @description The shop's members with roles, account state, last sign-in and open
         *     sessions — never IPs, devices or session details.
         */
        get: operations["list_members_admin_members_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Proposals */
        get: operations["list_proposals_admin_proposals_get"];
        put?: never;
        /**
         * Propose
         * @description Propose; nothing is applied. The facts present are kept with it.
         */
        post: operations["propose_admin_proposals_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/proposals/{proposal_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Proposal */
        get: operations["get_proposal_admin_proposals__proposal_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/proposals/{proposal_id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve
         * @description Approve and apply; the act's refusal is kept on the proposal.
         */
        post: operations["approve_admin_proposals__proposal_id__approve_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/proposals/{proposal_id}/decline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Decline
         * @description Decline; under the admin switch the proposer's own decline is a withdrawal.
         */
        post: operations["decline_admin_proposals__proposal_id__decline_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Settings */
        get: operations["get_settings_admin_settings_get"];
        /**
         * Update Settings
         * @description The two switches (floor on press_run_config, admin on the organisation).
         */
        put: operations["update_settings_admin_settings_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-control/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Agent Activity
         * @description Get paginated agent audit trail.
         */
        get: operations["get_agent_activity_agent_control_activity_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-control/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Agent Config
         * @description Get the org's agent configuration. Creates a default if none exists.
         */
        get: operations["get_agent_config_agent_control_config_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Agent Config
         * @description Update agent configuration with partial fields.
         */
        patch: operations["update_agent_config_agent_control_config_patch"];
        trace?: never;
    };
    "/agent-control/emergency-stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Activate Emergency Stop
         * @description Activate emergency stop — halts all agent processing.
         */
        post: operations["activate_emergency_stop_agent_control_emergency_stop_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-control/emergency-stop/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Release Emergency Stop
         * @description Release emergency stop — resumes agent processing.
         */
        post: operations["release_emergency_stop_agent_control_emergency_stop_release_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-control/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Agent Metrics
         * @description Get aggregate agent task metrics for the control center dashboard.
         */
        get: operations["get_agent_metrics_agent_control_metrics_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-control/sandbox/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Sandbox Test
         * @description Run a test message through the orchestrator in sandbox mode.
         */
        post: operations["run_sandbox_test_agent_control_sandbox_test_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit Feedback
         * @description Submit explicit feedback on agent output.
         */
        post: operations["submit_feedback_agent_feedback_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-feedback/agent/{agent_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Agent Performance
         * @description Get detailed per-agent feedback stats.
         */
        get: operations["get_agent_performance_agent_feedback_agent__agent_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-feedback/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Feedback Summary
         * @description Get aggregated feedback summary for the organization dashboard.
         */
        get: operations["get_feedback_summary_agent_feedback_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Agent Tasks
         * @description List agent tasks for the authenticated user's organization.
         */
        get: operations["list_agent_tasks_agent_tasks_get"];
        put?: never;
        /**
         * Create Agent Task
         * @description Create a new agent task.
         */
        post: operations["create_agent_task_agent_tasks_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Agent Task
         * @description Get a specific agent task.
         */
        get: operations["get_agent_task_agent_tasks__task_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Agent Task
         * @description Update an agent task.
         */
        patch: operations["update_agent_task_agent_tasks__task_id__patch"];
        trace?: never;
    };
    "/agent-tasks/{task_id}/approve-draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve Draft
         * @description Approve a parked draft response and send it to the customer.
         */
        post: operations["approve_draft_agent_tasks__task_id__approve_draft_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Complete Agent Task
         * @description Mark an agent task as completed.
         */
        post: operations["complete_agent_task_agent_tasks__task_id__complete_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/escalate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Escalate Agent Task
         * @description Escalate an agent task to human intervention.
         */
        post: operations["escalate_agent_task_agent_tasks__task_id__escalate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Task Messages
         * @description Get messages for an agent task.
         */
        get: operations["get_task_messages_agent_tasks__task_id__messages_get"];
        put?: never;
        /**
         * Send Task Message
         * @description Send an outbound message on an agent task.
         */
        post: operations["send_task_message_agent_tasks__task_id__messages_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/reject-draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject Draft
         * @description Reject a parked draft response without sending it.
         */
        post: operations["reject_draft_agent_tasks__task_id__reject_draft_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resume Agent Task
         * @description Resume an agent task after human intervention.
         */
        post: operations["resume_agent_task_agent_tasks__task_id__resume_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-tasks/{task_id}/takeover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Takeover Agent Task
         * @description Take over an agent task as a human operator.
         */
        post: operations["takeover_agent_task_agent_tasks__task_id__takeover_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export Report
         * @description Export a report as CSV, XLSX, or PDF.
         */
        get: operations["export_report_analytics_export_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/fulfillment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Fulfillment
         * @description Average fulfillment stage durations.
         */
        get: operations["get_fulfillment_analytics_fulfillment_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Orders
         * @description Order count over time grouped by period.
         */
        get: operations["get_orders_analytics_orders_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/portal-performance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Portal Performance
         * @description Per-portal order count and revenue.
         */
        get: operations["get_portal_performance_analytics_portal_performance_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/portal/{portal_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Client Analytics
         * @description Client/portal analytics — spend, frequency, top products.
         */
        get: operations["get_client_analytics_analytics_portal__portal_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/revenue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Revenue
         * @description Revenue over time grouped by period.
         */
        get: operations["get_revenue_analytics_revenue_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Summary
         * @description Dashboard summary KPIs.
         */
        get: operations["get_summary_analytics_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/team": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Performance
         * @description Team-wide performance metrics.
         *
         *     Access: Printer Admin sees all. Team Lead sees their team.
         *     Sales Rep sees own metrics only (enforced by role check).
         */
        get: operations["get_team_performance_analytics_team_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/team/{target_user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Rep Performance
         * @description Individual rep performance.
         *
         *     Sales reps can only view their own metrics.
         */
        get: operations["get_rep_performance_analytics_team__target_user_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/analytics/top-products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Top Products
         * @description Top products by revenue and quantity.
         */
        get: operations["get_top_products_analytics_top_products_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/audit-trail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search Audit Trail
         * @description Search audit trail with filters and pagination.
         */
        get: operations["search_audit_trail_audit_trail_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/audit-trail/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export Audit Trail
         * @description Export audit trail as CSV or JSON (max 10,000 rows).
         */
        get: operations["export_audit_trail_audit_trail_export_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change Password
         * @description Change the password with the current one in hand (t01): every other
         *     session ends at its next request; the caller gets fresh tokens; an audit
         *     row says who and from where. A wrong current password is a password
         *     guess: rate-limited like sign-in, and a locked account answers the same
         *     400 as a wrong password.
         */
        post: operations["change_password_auth_change_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/lockouts/clear": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Clear Lockout
         * @description A person clears a login lockout (j2o2): by the account's email, the
         *     source address, or both; recorded with who and when, the same override
         *     principle as holds. The printer's team managers only.
         */
        post: operations["clear_lockout_auth_lockouts_clear_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/lockouts/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Login Lockouts Status
         * @description The login rate limiter's dependency, for the staff side (ruling m2i7,
         *     4 Nov 2026: the public healthcheck says nothing about it). One live Redis
         *     ping, the mode, the fail-open / fail-closed counters since the task
         *     started, and since when Redis has been unreachable. No organisation rows:
         *     the state is per process, not per tenant. Same permission as the clear.
         */
        get: operations["login_lockouts_status_auth_lockouts_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login
         * @description Authenticate with email and password.
         *
         *     Rate limited per account and per source address (j2o2). A locked attempt
         *     gets the same status, body and bcrypt work as a wrong password: nothing
         *     says whether the account exists or that a lockout is in force.
         */
        post: operations["login_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout
         * @description Revoke the cookie's refresh token (single session logout) on the
         *     server, and clear the cookie in the browser; a cross-site request → 403.
         */
        post: operations["logout_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout All
         * @description Sign out everywhere (t01): every session of the caller revoked; each
         *     access token is refused at its next request.
         */
        post: operations["logout_all_auth_logout_all_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Me
         * @description The caller's own identity (name, email, organisation, roles) for the
         *     account menu — the token's subject only, never a path parameter.
         */
        get: operations["me_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me/portals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List My Portals
         * @description The portals the caller is assigned to, in the caller's organisation.
         *
         *     For the sign-in redirect (belq, 30 Oct 2026): a buyer with one portal is
         *     sent to it, one with several is offered a chooser, and the public landing
         *     page is never the destination. Any authenticated user may call it; a
         *     printer-side user with no assignments gets an empty list. Scoped to the
         *     session's organisation through the assignment lookup.
         */
        get: operations["list_my_portals_auth_me_portals_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password-reset/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm Password Reset
         * @description Consume the single-use token, set the password, end every session.
         */
        post: operations["confirm_password_reset_auth_password_reset_confirm_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password-reset/request": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request Password Reset
         * @description Ask for a reset link. One answer and one amount of work for every
         *     address: the row is written here, everything that depends on whether an
         *     account exists runs after the response has been sent.
         *
         *     Reset-by-email is a login surface (j2o2): the same per-account and
         *     per-source limits apply; a locked request gets the same answer and
         *     records nothing.
         */
        post: operations["request_password_reset_auth_password_reset_request_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh
         * @description Exchange the cookie's refresh token for a new pair (rotation): the new
         *     refresh token goes back in the cookie, the access token in the body.
         *     No cookie → 401; a cross-site request → 403 (item 6, 19 Nov 2026).
         */
        post: operations["refresh_auth_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register
         * @description Register a new user, organization, and issue tokens — only while public
         *     self-signup is on (t04, 18 Nov 2026; off in production): the service
         *     refuses on its own, whatever the frontend shows.
         */
        post: operations["register_auth_register_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Sessions
         * @description The caller's own live sessions (t01): opened and expiry times only.
         */
        get: operations["list_sessions_auth_sessions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Signup Availability
         * @description Public: whether "Create a free account" is on offer (t04). One boolean;
         *     no tenant data.
         */
        get: operations["signup_availability_auth_signup_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/bundles/{file_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Bundle
         * @description The bundle zip, for the bridge's shop only; ``X-Content-Sha256`` is
         *     the hash the bridge verifies before it writes anything.
         */
        get: operations["download_bundle_bridge_bundles__file_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/bundles/{file_id}/written": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bundle Written
         * @description The bridge's report on one bundle: written (sha256, file count, files)
         *     or not, with the reason. Audited on the unit.
         */
        post: operations["bundle_written_bridge_bundles__file_id__written_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/bundles/pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Pending Bundles
         * @description The bridge's shop's bundles not yet written on the share, oldest first.
         */
        get: operations["pending_bundles_bridge_bundles_pending_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Session State
         * @description Loop 1's signal (dispatch 16 Nov 2026, item 1): whether the shop's
         *     relayed Taylor session has since been found expired by a pull, so the
         *     bridge signs in again on the shop's machine and relays. Times and a
         *     status only; no cookie, no value, no login from Teaky.
         */
        get: operations["session_state_bridge_session_get"];
        put?: never;
        post?: never;
        /**
         * Drop Session
         * @description Staff only (ruling 18 Nov 2026): drop the shop's relayed Taylor
         *     session — on an uninstall, or when the machine is no longer trusted.
         *     The bridge's GET stays bridge-token-only and reads ``expired`` true
         *     until a new sign-in relays. Audited; no cookie, no value.
         */
        delete: operations["drop_session_bridge_session_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/shadow/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload Shadow History
         * @description The bridge's history.db (dispatch 20 Nov 2026, bridge item 2): the
         *     raw bytes with their sha256 in ``X-History-Sha256`` (required) and the
         *     source file's mtime in ``X-History-Mtime`` (optional, ISO-8601). A
         *     mismatch is refused and nothing is stored; a file the shop already holds
         *     answers with that row and ``stored`` false. The bytes never appear in a
         *     log or an audit row.
         */
        post: operations["upload_shadow_history_bridge_shadow_history_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/shadow/history/{upload_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Shadow History
         * @description One upload's bytes, with its sha256 in ``X-History-Sha256`` for the
         *     reader to verify; the shop's own uploads only; staff/admin only.
         */
        get: operations["download_shadow_history_bridge_shadow_history__upload_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/shadow/history/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Latest Shadow History
         * @description The newest history.db the shop's bridge uploaded. Staff/admin only
         *     (``bridge:manage``, the permission that manages the bridge; ruling 20 Nov
         *     2026: the shadow reader's contract is unchanged — its reads stay the
         *     listed ones). Metadata only; the bytes are the read below.
         */
        get: operations["latest_shadow_history_bridge_shadow_history_latest_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Bridge Tokens */
        get: operations["list_bridge_tokens_bridge_tokens_get"];
        put?: never;
        /**
         * Issue Bridge Token
         * @description A new token for the caller's shop. The token is in this response and
         *     nowhere else; it is stored as its sha256.
         */
        post: operations["issue_bridge_token_bridge_tokens_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/tokens/{token_id}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke Bridge Token */
        post: operations["revoke_bridge_token_bridge_tokens__token_id__revoke_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bridge/tokens/{token_id}/rotate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Rotate Bridge Token
         * @description A new token under the same label, shown once; the old one revoked;
         *     one audit row names both (ruling 10 Nov 2026, §E.3).
         */
        post: operations["rotate_bridge_token_bridge_tokens__token_id__rotate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/bug-reports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Report Bug
         * @description Writes the record and sends the operator one email; 429 over the
         *     per-member limit. The caller's own report; nothing cross-tenant.
         */
        post: operations["report_bug_bug_reports_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/business-entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Business Entities
         * @description The caller's shop's entities. Read-only: an empty list means the shop
         *     is not seeded yet (POST /business-entities/seed).
         */
        get: operations["list_business_entities_business_entities_get"];
        put?: never;
        /** Create Business Entity */
        post: operations["create_business_entity_business_entities_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/business-entities/{entity_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Business Entity */
        patch: operations["update_business_entity_business_entities__entity_id__patch"];
        trace?: never;
    };
    "/business-entities/rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Business Entity Rules */
        get: operations["list_business_entity_rules_business_entities_rules_get"];
        put?: never;
        /** Create Business Entity Rule */
        post: operations["create_business_entity_rule_business_entities_rules_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/business-entities/seed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Seed Business Entities
         * @description Idempotent: the three seeds and the catch-all rule for a shop with no
         *     entities, then the shop's unassigned orders and release units assigned
         *     by its rules.
         */
        post: operations["seed_business_entities_business_entities_seed_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Capabilities
         * @description List all available capabilities.
         */
        get: operations["list_capabilities_capabilities_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/company-profiles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Company Profile
         * @description Create a company profile for the authenticated user's organization.
         */
        post: operations["create_company_profile_company_profiles_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/company-profiles/{profile_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Company Profile
         * @description Get a company profile by ID, scoped to the caller's organization.
         *
         *     Cross-tenant PK returns 404 (per D3, never 403).
         */
        get: operations["get_company_profile_company_profiles__profile_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Company Profile
         * @description Partially update a company profile in the caller's organization.
         *
         *     Cross-tenant PK returns 404 (per D3, never 403). Tenant is server-derived;
         *     the row cannot be relocated cross-tenant via this path (repo strips
         *     ``organization_id`` from the SET column list — S59 Q2 standing pattern).
         */
        patch: operations["update_company_profile_company_profiles__profile_id__patch"];
        trace?: never;
    };
    "/company-profiles/by-organization/{organization_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Company Profile By Organization
         * @description Get the company profile for an organization.
         *
         *     S59 Q1 option (a): the path ``organization_id`` MUST match the caller's
         *     own tenant. The route reads as "get the profile for org X" but org X
         *     can only ever be the caller's own org — there is no cross-tenant reader
         *     to serve here (the "printer admin overseeing all client portals" is an
         *     intra-org read; portals are business units inside a single printer org).
         *     Cross-org requests return 404 (per D3, never 403).
         *
         *     Any intra-org role/scope refinement (printer-admin-all-portals vs
         *     sales-rep-subset = ORG_WIDE vs PORTAL_SCOPED) is Phase 3 / D15 / OQ3,
         *     explicitly out of PR 1.
         */
        get: operations["get_company_profile_by_organization_company_profiles_by_organization__organization_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/crm/activity/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Activity
         * @description Get CRM activity feed for a client user — a member of the caller's
         *     organisation; 404 otherwise (independent review, 19 Nov 2026).
         */
        get: operations["get_activity_crm_activity__user_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/crm/activity/{user_id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Export Activity
         * @description Export client activity in clipboard, CSV, or XLSX format.
         */
        post: operations["export_activity_crm_activity__user_id__export_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/crm/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Webhooks
         * @description List all active webhook subscriptions for the organization.
         */
        get: operations["list_webhooks_crm_webhooks_get"];
        put?: never;
        /**
         * Create Webhook
         * @description Create a new webhook subscription.
         */
        post: operations["create_webhook_crm_webhooks_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/crm/webhooks/{subscription_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Webhook
         * @description Delete a webhook subscription.
         */
        delete: operations["delete_webhook_crm_webhooks__subscription_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/crm/webhooks/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Test Webhook
         * @description Send a test payload to a webhook URL.
         */
        post: operations["test_webhook_crm_webhooks_test_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/csp-report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Csp Report */
        post: operations["csp_report_csp_report_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/{session_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Design Session
         * @description Get the current state of a design session.
         */
        get: operations["get_design_session_design__session_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/{session_id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Export Design
         * @description Export a design session as an editable file (SVG or vector PDF).
         */
        post: operations["export_design_design__session_id__export_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/{session_id}/handoff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Handoff Design
         * @description Hand off a design session to the human design team.
         */
        post: operations["handoff_design_design__session_id__handoff_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/{session_id}/iterate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Iterate Design
         * @description Iterate on an existing design session with a modification instruction.
         */
        post: operations["iterate_design_design__session_id__iterate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Design
         * @description Generate a new design from a natural language description.
         */
        post: operations["generate_design_design_generate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/design/product-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Product Types
         * @description List all available product types with their decoration areas.
         */
        get: operations["get_product_types_design_product_types_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/equipment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search Equipment
         * @description Search equipment visible to the caller: own-org custom + seeded.
         */
        get: operations["search_equipment_equipment_get"];
        put?: never;
        /**
         * Create Custom Equipment
         * @description Create a custom equipment entry for the user's organization.
         *
         *     Specifications are validated at request-parse time via the
         *     model_validator on CreateEquipmentRequest, which dispatches on
         *     equipment_type through the equipment_specifications registry.
         *     Validation failures surface as HTTP 422 with the app-wide sanitized
         *     error contract:
         *     ``{"detail": [{"type": str, "loc": list, "msg": str}, ...]}``.
         *     Submitted values are intentionally excluded from the response.
         */
        post: operations["create_custom_equipment_equipment_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/equipment/{equipment_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Equipment
         * @description Get a single equipment record by ID.
         */
        get: operations["get_equipment_equipment__equipment_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/equipment/capability-suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Capability Suggestions
         * @description Get suggested capabilities based on the user's equipment.
         *
         *     Looks up equipment types for the given IDs and maps them to suggested
         *     capabilities using the equipment-to-capability knowledge mapping.
         */
        get: operations["get_capability_suggestions_equipment_capability_suggestions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/escalations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Escalation
         * @description Create a smart escalation with auto-assembled context.
         */
        post: operations["create_escalation_escalations_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/escalations/{escalation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Escalation
         * @description Get a single escalation with full context.
         */
        get: operations["get_escalation_escalations__escalation_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/escalations/{escalation_id}/respond": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Respond To Escalation
         * @description Respond to an escalation.
         */
        patch: operations["respond_to_escalation_escalations__escalation_id__respond_patch"];
        trace?: never;
    };
    "/escalations/incoming": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Incoming Escalations
         * @description List escalations routed to the current user (by user ID or role).
         */
        get: operations["list_incoming_escalations_escalations_incoming_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/escalations/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List My Escalations
         * @description List escalations created by the current user.
         */
        get: operations["list_my_escalations_escalations_mine_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/escalations/routing-options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Routing Options
         * @description Get intelligent routing options based on role and context.
         */
        get: operations["get_routing_options_escalations_routing_options_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{file_id}/convert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert File
         * @description Convert a file's format, color mode, or DPI.
         */
        post: operations["convert_file_files__file_id__convert_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{file_id}/preflight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Preflight
         * @description Run preflight validation on a file and store the report.
         */
        post: operations["run_preflight_files__file_id__preflight_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{file_id}/preflight-report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Preflight Report
         * @description Get the stored preflight report for a file.
         */
        get: operations["get_preflight_report_files__file_id__preflight_report_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{file_id}/production-pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Production Pdf
         * @description Generate a production-ready PDF with crop marks, color bars, and file info.
         */
        post: operations["generate_production_pdf_files__file_id__production_pdf_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/healthcheck": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Healthcheck
         * @description Load-balancer and container health, database-aware (ruling 2026-10-21).
         *
         *     Returns 200 only when this process can open a FRESH database connection
         *     with the credential it holds; 503 otherwise, so the load balancer stops
         *     routing to a task whose credential has rotated away and ECS replaces it
         *     — the 19 Oct 2026 incident, where a static 200 suppressed the alarm for
         *     six hours. The trade-off the old docstring warned of (a database blip
         *     recycles tasks) is accepted: the ALB needs three failures 30 s apart
         *     before it acts, and a replacement task starts with the current secret.
         */
        get: operations["healthcheck_healthcheck_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/help/articles/{article_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Article
         * @description Get a single help article by ID.
         */
        get: operations["get_article_help_articles__article_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/help/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search Help
         * @description Search help articles by query with role and page filtering.
         */
        post: operations["search_help_help_search_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/help/suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Suggestions
         * @description Get contextual help suggestions for the current page and role.
         */
        get: operations["get_suggestions_help_suggestions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Import History
         * @description List past imports for the organization.
         */
        get: operations["list_import_history_import_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/import/{session_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Import Session
         * @description Get import session status and results.
         */
        get: operations["get_import_session_import__session_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/import/{session_id}/execute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Execute Import
         * @description Execute the import with the stored column mapping.
         */
        post: operations["execute_import_import__session_id__execute_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/import/{session_id}/map": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Map Columns
         * @description Submit column mapping and get validation results.
         */
        post: operations["map_columns_import__session_id__map_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/import/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload Import File
         * @description Upload a CSV/XLSX file and get a preview with detected columns.
         */
        post: operations["upload_import_file_import_upload_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/inspire/pool": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pool */
        get: operations["pool_intake_inspire_pool_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/poll-now": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Poll Now
         * @description Read the inbound bucket for the caller's shop now. No bucket
         *     configured, or a bucket that cannot be read, answers 409 with the
         *     reason; nothing is sent.
         */
        post: operations["poll_now_intake_pagedna_poll_now_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/pool": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pool */
        get: operations["pool_intake_pagedna_pool_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/sftp/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Sftp Files
         * @description The raw file records of the caller's shop: name, size, sha256, when
         *     received, which run, stored or refused with the reason.
         */
        get: operations["sftp_files_intake_pagedna_sftp_files_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/sftp/pull-now": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sftp Pull Now
         * @description Start a pull of the caller's shop's SFTP drop. No connection in the
         *     secrets store, a password, or a host off the allow-list answers 409
         *     with the reason before anything connects; a run already running answers
         *     409 naming it. Nothing is sent or moved on the remote.
         */
        post: operations["sftp_pull_now_intake_pagedna_sftp_pull_now_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/sftp/pulls": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Sftp Pulls */
        get: operations["sftp_pulls_intake_pagedna_sftp_pulls_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/sftp/pulls/{pull_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Sftp Pull By Id */
        get: operations["sftp_pull_by_id_intake_pagedna_sftp_pulls__pull_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/pagedna/sftp/rows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Sftp Rows
         * @description The raw rows of the caller's shop and what each became.
         */
        get: operations["sftp_rows_intake_pagedna_sftp_rows_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/place-pool": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Place Pool
         * @description Run the press-run placer over the caller's shop's pool once, now
         *     (dispatch 16 Nov 2026): the run a pull makes after writing an order or
         *     attaching art, for a fact that arrived outside a pull (the spec import
         *     put a stock in force; the lines it held still wait). Idempotent over an
         *     unchanged record; nothing is fetched and no login is attempted.
         */
        post: operations["place_pool_intake_taylor_place_pool_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/pool": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Pool */
        get: operations["pool_intake_taylor_pool_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/pull-now": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Pull Now
         * @description Start a pull of the caller's shop (ruling 11 Nov 2026: pull 1 on rev 36
         *     answered 504 from the ALB after 60 s while the run went on). 202 with the
         *     run row as ``running``; the run continues on the schedule's code path and
         *     finishes the row; ``GET /intake/taylor/pulls/{id}`` reads it. No saved
         *     session answers 409 before anything starts; a run already running
         *     answers 409 naming it. No login is attempted anywhere.
         */
        post: operations["pull_now_intake_taylor_pull_now_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/pulls": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Pulls
         * @description The caller's shop's runs, latest first, as their rows record them.
         */
        get: operations["pulls_intake_taylor_pulls_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/pulls/{pull_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Pull By Id
         * @description One run of the caller's shop: ``running`` until the background task
         *     finishes it, then its final status, the counts the row holds, the
         *     warning or error text, and ``finished_at``.
         */
        get: operations["pull_by_id_intake_taylor_pulls__pull_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/intake/taylor/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Relay Session
         * @description The shop's bridge relays the Taylor session PortalClient.cs saved;
         *     Teaky stores it in the secrets store under the shop. The cookie values
         *     are never logged or echoed; the answer is the count.
         */
        post: operations["relay_session_intake_taylor_session_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Oauth Callback
         * @description Handle QuickBooks OAuth callback.
         *
         *     State is a signed JWT issued by /connect; the organization_id is extracted
         *     from its verified claims, not from the raw query value. See
         *     ``printer-agent2-0kmw`` (TEN-032 fix) for the CSRF-linking vector this
         *     verification closes and the state-token shape.
         */
        get: operations["oauth_callback_integrations_quickbooks_callback_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Sync Config
         * @description Get QBO sync configuration for the organization.
         */
        get: operations["get_sync_config_integrations_quickbooks_config_get"];
        /**
         * Update Sync Config
         * @description Update QBO sync configuration.
         */
        put: operations["update_sync_config_integrations_quickbooks_config_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/connect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Connect Url
         * @description Get the QuickBooks OAuth authorization URL.
         */
        get: operations["get_connect_url_integrations_quickbooks_connect_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/connection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Connection Status
         * @description Get current QBO connection status.
         */
        get: operations["get_connection_status_integrations_quickbooks_connection_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/sync-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Sync Logs
         * @description List recent QBO sync logs for the organization.
         */
        get: operations["get_sync_logs_integrations_quickbooks_sync_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/integrations/quickbooks/sync-status/{order_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Order Sync Status
         * @description Get sync status for a specific order.
         */
        get: operations["get_order_sync_status_integrations_quickbooks_sync_status__order_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inventory/low-stock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Low Stock Items
         * @description Get all low-stock items for the authenticated user's organization.
         */
        get: operations["get_low_stock_items_inventory_low_stock_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inventory/reorder-recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Reorder Recommendations
         * @description Get AI-generated reorder recommendations based on order history.
         */
        get: operations["get_reorder_recommendations_inventory_reorder_recommendations_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Master Catalog
         * @description Browse and search the master product catalog.
         */
        get: operations["list_master_catalog_master_catalog_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog/{product_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Master Product
         * @description Get a single master catalog product by ID.
         */
        get: operations["get_master_product_master_catalog__product_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Categories
         * @description Get all distinct categories in the master catalog.
         */
        get: operations["list_categories_master_catalog_categories_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog/clone": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Clone To Portal
         * @description Clone a master catalog product into a portal.
         */
        post: operations["clone_to_portal_master_catalog_clone_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog/clone-category": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Clone Category
         * @description Clone all products in a category into a portal.
         */
        post: operations["clone_category_master_catalog_clone_category_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/master-catalog/seed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Seed Catalog
         * @description Seed the master catalog with built-in product data. Super admin only.
         */
        post: operations["seed_catalog_master_catalog_seed_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Messages
         * @description List messages for the authenticated user's organization.
         */
        get: operations["list_messages_messages_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Mis Health
         * @description Get MIS health status for the organization.
         */
        get: operations["get_mis_health_mis_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/orders/{order_id}/push": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Manual Push Order
         * @description Manually push an order to the configured MIS (explicit operator action).
         */
        post: operations["manual_push_order_mis_orders__order_id__push_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/orders/{order_id}/sync-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Order Sync Status
         * @description Get MIS sync status for an order, scoped to the caller's organization.
         *
         *     Cross-tenant order_id returns a status with empty defaults (no sync log
         *     entry found under this tenant). D3 mismatch helper emits telemetry
         *     server-side when the order exists under a different tenant.
         */
        get: operations["get_order_sync_status_mis_orders__order_id__sync_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/products/needing-template": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Products Needing Template
         * @description The template queue: active products with no DocketManager External
         *     Identifier. An order for any of these is held (sync-log status
         *     needs_template) and emailed to the order desk until the identifier is set,
         *     then re-pushed with POST /mis/orders/{order_id}/push.
         */
        get: operations["list_products_needing_template_mis_products_needing_template_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/queue-mappings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Queue Mappings
         * @description Get DM queue → Teaky status mappings for the organization.
         */
        get: operations["get_queue_mappings_mis_queue_mappings_get"];
        /**
         * Update Queue Mappings
         * @description Update DM queue → Teaky status mappings for the organization.
         */
        put: operations["update_queue_mappings_mis_queue_mappings_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mis/sync-log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Sync Log
         * @description Get recent MIS sync log entries for the organization.
         */
        get: operations["get_sync_log_mis_sync_log_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Notifications
         * @description List notifications for the current user.
         */
        get: operations["list_notifications_notifications_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/mark-all-read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark All Read
         * @description Mark all notifications as read.
         */
        post: operations["mark_all_read_notifications_mark_all_read_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/mark-read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark Read
         * @description Mark specific notifications as read.
         */
        post: operations["mark_read_notifications_mark_read_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Preferences
         * @description Get notification preferences for the current user.
         */
        get: operations["get_preferences_notifications_preferences_get"];
        /**
         * Update Preferences
         * @description Update notification preferences for the current user.
         */
        put: operations["update_preferences_notifications_preferences_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/unread-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Unread Count
         * @description Get the unread notification count for the current user.
         */
        get: operations["get_unread_count_notifications_unread_count_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/onboarding/upload-document": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload Onboarding Document
         * @description Upload an equipment list or capabilities document for AI processing.
         *
         *     Saves the file and creates an agent task for the Equipment Expert
         *     to parse and extract equipment and capabilities from the document.
         */
        post: operations["upload_onboarding_document_onboarding_upload_document_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Orders
         * @description List orders for the current user's organization.
         *
         *     Team leads see only orders for their assigned portals plus reportees' portals.
         *     Admins and other roles see all organization orders.
         */
        get: operations["list_orders_orders_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Order
         * @description Get an order by ID. Must belong to the user's organization.
         *
         *     Repo-layer tenant filter (S73 D2 BOTH-boundary reshape) makes the
         *     follow-up ``order.organization_id != user.organization_id`` check
         *     structurally unreachable per ruling 66 collapse test; the
         *     cross-tenant path returns None here (surfaced as 404 per D3).
         */
        get: operations["get_order_orders__order_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Order
         * @description Update order fields (notes, tags, tracking).
         *
         *     Repo-layer tenant filter (S73 D2) collapses the pre-fetch org check
         *     per ruling 66; the update call fails-closed via D3 on cross-tenant.
         */
        patch: operations["update_order_orders__order_id__patch"];
        trace?: never;
    };
    "/orders/{order_id}/business-entity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Override Order Business Entity
         * @description A person's override of the order's business entity (13 Nov 2026
         *     evening, C): an entity of the caller's shop and a reason; audited as
         *     business_entity.override. An order or entity of another shop is 404.
         */
        post: operations["override_order_business_entity_orders__order_id__business_entity_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel Order
         * @description Cancel an order with a reason.
         *
         *     Pre-fetch verify collapsed per ruling 66 (S73 D2) — lifecycle_service
         *     enforces tenant boundary at the fetch inside cancel_order.
         */
        post: operations["cancel_order_orders__order_id__cancel_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/costs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Order Costs
         * @description The printer-side cost view of an order (GP capture, plan §5.3).
         *
         *     Printer roles only (ORDER_READ is not held by any buyer-side role); the
         *     vendor cost basis never travels on the buyer's Order model.
         */
        get: operations["get_order_costs_orders__order_id__costs_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Order Costs
         * @description Staff edit of the manual order-level cost inputs (outbound freight,
         *     processing fee, invoice month).
         */
        patch: operations["update_order_costs_orders__order_id__costs_patch"];
        trace?: never;
    };
    "/orders/{order_id}/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Order Files
         * @description List all files for an order.
         */
        get: operations["list_order_files_orders__order_id__files_get"];
        put?: never;
        /**
         * Upload Order File
         * @description Upload a file to an order.
         */
        post: operations["upload_order_file_orders__order_id__files_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/files/{file_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Order File
         * @description Delete a file from an order.
         */
        delete: operations["delete_order_file_orders__order_id__files__file_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/invoice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Invoice
         * @description Generate and return invoice data for an order.
         */
        get: operations["get_invoice_orders__order_id__invoice_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/invoice/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Invoice Pdf
         * @description Generate and return a PDF invoice for an order.
         */
        get: operations["get_invoice_pdf_orders__order_id__invoice_pdf_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/line-items/{line_item_id}/costs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Line Item Costs
         * @description Staff edit of one line's manual cost inputs (cost snapshot correction,
         *     decoration charge, inbound freight allocation).
         */
        patch: operations["update_line_item_costs_orders__order_id__line_items__line_item_id__costs_patch"];
        trace?: never;
    };
    "/orders/{order_id}/mark-done": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark Order Done */
        post: operations["mark_order_done_orders__order_id__mark_done_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/production-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Production Status
         * @description Update the granular production status of an order (manual tracking).
         *
         *     Used when the MIS is disconnected or set to manual mode.
         *     Valid statuses: received, in_prepress, printing, finishing,
         *     quality_check, ready_to_ship, shipped, picked_up.
         */
        patch: operations["update_production_status_orders__order_id__production_status_patch"];
        trace?: never;
    };
    "/orders/{order_id}/proofs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Proofs
         * @description List all proofs for an order. A buyer sees only their own orders' (S86).
         */
        get: operations["list_proofs_orders__order_id__proofs_get"];
        put?: never;
        /**
         * Submit Proof
         * @description Submit a proof for a line item in an order.
         */
        post: operations["submit_proof_orders__order_id__proofs_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/push-alone": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Push Alone */
        post: operations["push_alone_orders__order_id__push_alone_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Release Order
         * @description Release a held order to production once its proof is approved — the
         *     explicit act that sends a changed order to DocketManager. A second release
         *     of the same order is refused with 409.
         */
        post: operations["release_order_orders__order_id__release_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/release/link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Link Release To Docketmanager Order
         * @description A person checked DocketManager and found the job: record its number and
         *     mark the order released. Never resends.
         */
        post: operations["link_release_to_docketmanager_order_orders__order_id__release_link_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/release/not-found": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm Release Not In Docketmanager
         * @description A person checked DocketManager and the job is not there: the order may
         *     be released again.
         */
        post: operations["confirm_release_not_in_docketmanager_orders__order_id__release_not_found_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Order Status
         * @description Transition order to a new status (state machine validated).
         *
         *     Pre-fetch verify collapsed per ruling 66 (S73 D2 BOTH-boundary
         *     reshape) — lifecycle_service.update_status now enforces the tenant
         *     boundary via order_repo's tenant WHERE.
         */
        patch: operations["update_order_status_orders__order_id__status_patch"];
        trace?: never;
    };
    "/orders/{order_id}/void": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Void Order */
        post: operations["void_order_orders__order_id__void_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/{order_id}/whereabouts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Order Whereabouts
         * @description The order's lines, units, route position, scans, holds, pushes and
         *     shipment, the caller's shop only. The floor and the office read it; the
         *     shadow_reader reads it as it reads the queue. Another shop's order is
         *     404, the same shape as none.
         */
        get: operations["order_whereabouts_orders__order_id__whereabouts_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/on-behalf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Order On Behalf
         * @description Create an order on behalf of a customer (staff-assisted ordering).
         */
        post: operations["create_order_on_behalf_orders_on_behalf_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orders/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Shop Tags
         * @description The shop's tag list for the pickers (t08, 19 Nov 2026): the union of
         *     the tags on its orders and the tags its rules add; the caller's own
         *     organisation by JWT, no path parameter. Declared before ``/{order_id}``
         *     so "tags" is never read as an id.
         */
        get: operations["list_shop_tags_orders_tags_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Org Capabilities
         * @description List capabilities assigned to an organization.
         */
        get: operations["list_org_capabilities_organizations__organization_id__capabilities_get"];
        /**
         * Replace Org Capabilities
         * @description Replace all capabilities for an organization.
         */
        put: operations["replace_org_capabilities_organizations__organization_id__capabilities_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/equipment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Org Equipment
         * @description List all equipment associations for an organization.
         */
        get: operations["list_org_equipment_organizations__organization_id__equipment_get"];
        put?: never;
        /**
         * Add Org Equipment
         * @description Add an equipment association to an organization.
         */
        post: operations["add_org_equipment_organizations__organization_id__equipment_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/{organization_id}/equipment/{equipment_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove Org Equipment
         * @description Remove an equipment association from an organization.
         */
        delete: operations["remove_org_equipment_organizations__organization_id__equipment__equipment_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get My Organization
         * @description The caller's own organisation. Printer-side only (settings:view); there
         *     is no path parameter, so there is nothing cross-tenant to ask for.
         */
        get: operations["get_my_organization_organizations_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update My Organization
         * @description The caller's own organisation's display name (t06, 19 Nov 2026):
         *     settings:manage (the printer_admin), no path parameter — the JWT's
         *     organisation and no other. Audited.
         */
        patch: operations["update_my_organization_organizations_me_patch"];
        trace?: never;
    };
    "/organizations/me/press-run-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Press Run Config
         * @description The caller's shop's whole press-run configuration (ruling 11 Nov
         *     2026): read it from the real shop as its admin, hand it to the shadow
         *     shop's seed below. No secret lives in it.
         */
        get: operations["get_press_run_config_organizations_me_press_run_config_get"];
        /**
         * Seed Press Run Config
         * @description Seed the caller's shop's press-run configuration from one handed in
         *     (ruling 11 Nov 2026). ``dry_run`` (the default) names the keys that would
         *     change and writes nothing.
         */
        put: operations["seed_press_run_config_organizations_me_press_run_config_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/me/production-settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Production Settings
         * @description The shop's production rules (Part A, 5 Nov 2026). The caller's own
         *     organisation by JWT; no path parameter, nothing cross-tenant to ask for.
         */
        get: operations["get_production_settings_organizations_me_production_settings_get"];
        /**
         * Update Production Settings
         * @description PUT the whole resource; an unknown timezone is refused with the reason
         *     and nothing is written. A change of the bridge switch is audited with the
         *     caller and address (ruling 20 Nov 2026).
         */
        put: operations["update_production_settings_organizations_me_production_settings_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/me/shell": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Production Shell
         * @description The shell's name and mark for the caller's own organisation (ruling 18
         *     Nov 2026, addendum 17:3xZ): every signed-in caller — buyer, portal admin,
         *     staff, shadow_reader — gets their own organisation's; nobody else's. No
         *     path parameter — nothing cross-tenant to ask for; nothing in it is a
         *     setting, a cost or a contact.
         */
        get: operations["get_production_shell_organizations_me_shell_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/organizations/me/tag-rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Tag Rules
         * @description The shop's customer → tags rules (t08, 19 Nov 2026), edited under
         *     production settings beside the list-view default. The caller's own
         *     organisation by JWT; no path parameter.
         */
        get: operations["get_tag_rules_organizations_me_tag_rules_get"];
        /**
         * Update Tag Rules
         * @description PUT the rules whole (an empty list clears them); every other
         *     ``press_run_config`` key is kept; a change is audited.
         */
        put: operations["update_tag_rules_organizations_me_tag_rules_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Portal
         * @description Get public portal data by slug. No authentication required.
         */
        get: operations["get_public_portal_p__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/cart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Cart
         * @description Get the current user's active cart for this portal.
         */
        get: operations["get_cart_p__slug__cart_get"];
        put?: never;
        /**
         * Get Or Create Cart
         * @description Get or create the active cart for the current user in this portal.
         */
        post: operations["get_or_create_cart_p__slug__cart_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/cart/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add Cart Item
         * @description Add an item to the cart. Creates the cart if it doesn't exist.
         */
        post: operations["add_cart_item_p__slug__cart_items_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/cart/items/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove Cart Item
         * @description Remove an item from the cart.
         */
        delete: operations["remove_cart_item_p__slug__cart_items__item_id__delete"];
        options?: never;
        head?: never;
        /**
         * Update Cart Item
         * @description Update the quantity of a cart item.
         */
        patch: operations["update_cart_item_p__slug__cart_items__item_id__patch"];
        trace?: never;
    };
    "/p/{slug}/checkout/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm Checkout
         * @description Confirm checkout: create order, mark as paid.
         */
        post: operations["confirm_checkout_p__slug__checkout_confirm_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/checkout/create-payment-intent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Payment Intent
         * @description Create a Stripe PaymentIntent for the cart total.
         */
        post: operations["create_payment_intent_p__slug__checkout_create_payment_intent_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/fundraiser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Fundraiser
         * @description Get public fundraiser data. No authentication required.
         */
        get: operations["get_public_fundraiser_p__slug__fundraiser_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/orders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List My Orders
         * @description List orders for the current user in this portal.
         */
        get: operations["list_my_orders_p__slug__orders_get"];
        put?: never;
        /**
         * Create Order
         * @description Create an order from the user's cart.
         */
        post: operations["create_order_p__slug__orders_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/orders/{order_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get My Order
         * @description Get a specific order by ID for the current user.
         */
        get: operations["get_my_order_p__slug__orders__order_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/orders/safe-order-check/{product_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check Safe Order
         * @description Check if this portal has an approved proof for the product variant (safe order).
         */
        get: operations["check_safe_order_p__slug__orders_safe_order_check__product_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Products
         * @description Get active products for a public portal. No authentication required:
         *     published prices only, never cost, markup, floor, vendor or ItemCode.
         */
        get: operations["get_public_products_p__slug__products_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/products/{product_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Product
         * @description Get a single product from a public portal. No authentication required:
         *     published prices only, never cost, markup, floor, vendor or ItemCode.
         */
        get: operations["get_public_product_p__slug__products__product_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/products/{product_id}/stock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Product Stock
         * @description Get stock availability for a product's variants. No authentication required.
         */
        get: operations["get_public_product_stock_p__slug__products__product_id__stock_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Portal User
         * @description Register a new end-user on a portal. Checks self_registration setting.
         *     The session is answered like sign-in: refresh token in the cookie, access
         *     token in the body (item 6).
         */
        post: operations["register_portal_user_p__slug__register_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/p/{slug}/supporters": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Public Supporters
         * @description Named supporters of a fundraiser, public fields only. No authentication required.
         *
         *     Returns the public whitelist model, never the internal supporter record
         *     (S87 exposure 6: the record carried ``order_id`` and ``portal_id`` to
         *     unauthenticated callers).
         */
        get: operations["get_public_supporters_p__slug__supporters_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/playbooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Playbooks
         * @description List available playbooks (public + org's private).
         */
        get: operations["list_playbooks_playbooks_get"];
        put?: never;
        /**
         * Create Playbook
         * @description Create a private playbook for the organization.
         */
        post: operations["create_playbook_playbooks_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/playbooks/{playbook_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Playbook
         * @description Get a single playbook with full details.
         */
        get: operations["get_playbook_playbooks__playbook_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Playbook
         * @description Update an existing playbook.
         */
        patch: operations["update_playbook_playbooks__playbook_id__patch"];
        trace?: never;
    };
    "/playbooks/{playbook_id}/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Apply Playbook
         * @description Apply a playbook to a portal: create categories and products.
         */
        post: operations["apply_playbook_playbooks__playbook_id__apply_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/playbooks/{playbook_id}/scale": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Scale Playbook
         * @description Scale a playbook to a specific size and budget tier.
         */
        post: operations["scale_playbook_playbooks__playbook_id__scale_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/playbooks/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate Playbook
         * @description Generate a playbook from a natural language description.
         */
        post: operations["generate_playbook_playbooks_generate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Portals
         * @description List all portals for the authenticated user's organization.
         */
        get: operations["list_portals_portals_get"];
        put?: never;
        /**
         * Create Portal
         * @description Create a new portal for the authenticated user's organization.
         */
        post: operations["create_portal_portals_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Portal
         * @description Get a portal by ID.
         */
        get: operations["get_portal_portals__portal_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Portal
         * @description Partially update a portal.
         */
        patch: operations["update_portal_portals__portal_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Archive Portal
         * @description Archive a portal — deep archive, data preserved.
         */
        post: operations["archive_portal_portals__portal_id__archive_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/brand-assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Brand Assets
         * @description List all current brand assets for a portal.
         */
        get: operations["list_brand_assets_portals__portal_id__brand_assets_get"];
        put?: never;
        /**
         * Upload Brand Asset
         * @description Upload a new brand asset.
         */
        post: operations["upload_brand_asset_portals__portal_id__brand_assets_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/brand-assets/{asset_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Brand Asset
         * @description Get a single brand asset by ID.
         */
        get: operations["get_brand_asset_portals__portal_id__brand_assets__asset_id__get"];
        put?: never;
        post?: never;
        /**
         * Delete Brand Asset
         * @description Delete a brand asset.
         */
        delete: operations["delete_brand_asset_portals__portal_id__brand_assets__asset_id__delete"];
        options?: never;
        head?: never;
        /**
         * Update Brand Asset
         * @description Update metadata on an existing brand asset.
         */
        patch: operations["update_brand_asset_portals__portal_id__brand_assets__asset_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/brand-assets/{asset_id}/check-quality": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Check Asset Quality
         * @description Run quality checks on a brand asset.
         *
         *     Optionally re-upload the file content for analysis. If no file is provided,
         *     the check runs with metadata only.
         */
        post: operations["check_asset_quality_portals__portal_id__brand_assets__asset_id__check_quality_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/brand-assets/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Vault Health
         * @description Get vault health summary for a portal.
         */
        get: operations["get_vault_health_portals__portal_id__brand_assets_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/brand-assets/migrate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Migrate Scraped Assets
         * @description Migrate scraped brand assets into the vault.
         *
         *     This endpoint is a placeholder for the migration workflow.
         *     In practice, the scraping service would call the brand asset service directly.
         */
        post: operations["migrate_scraped_assets_portals__portal_id__brand_assets_migrate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Categories */
        get: operations["list_categories_portals__portal_id__categories_get"];
        put?: never;
        /** Create Category */
        post: operations["create_category_portals__portal_id__categories_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/categories/{category_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Category */
        get: operations["get_category_portals__portal_id__categories__category_id__get"];
        put?: never;
        post?: never;
        /** Delete Category */
        delete: operations["delete_category_portals__portal_id__categories__category_id__delete"];
        options?: never;
        head?: never;
        /** Update Category */
        patch: operations["update_category_portals__portal_id__categories__category_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/custom-domain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set Custom Domain
         * @description Set or remove a custom domain for a portal, with DNS CNAME verification.
         */
        put: operations["set_custom_domain_portals__portal_id__custom_domain_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/expiration": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Set Expiration
         * @description Set or update the auto-expiration date for a portal.
         */
        patch: operations["set_expiration_portals__portal_id__expiration_patch"];
        trace?: never;
    };
    "/portals/{portal_id}/fundraiser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Fundraiser
         * @description Get fundraiser details.
         */
        get: operations["get_fundraiser_portals__portal_id__fundraiser_get"];
        put?: never;
        /**
         * Configure Fundraiser
         * @description Configure a portal as a fundraiser store.
         */
        post: operations["configure_fundraiser_portals__portal_id__fundraiser_post"];
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Fundraiser
         * @description Update fundraiser settings.
         */
        patch: operations["update_fundraiser_portals__portal_id__fundraiser_patch"];
        trace?: never;
    };
    "/portals/{portal_id}/fundraiser/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Close Fundraiser
         * @description Close a fundraiser and generate the final report.
         */
        post: operations["close_fundraiser_portals__portal_id__fundraiser_close_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/fundraiser/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Fundraiser Report
         * @description Get fundraiser report (exportable).
         */
        get: operations["get_fundraiser_report_portals__portal_id__fundraiser_report_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/fundraiser/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Fundraiser Stats
         * @description Get fundraiser statistics.
         */
        get: operations["get_fundraiser_stats_portals__portal_id__fundraiser_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Portal Invitations
         * @description List pending invitations for a portal.
         */
        get: operations["list_portal_invitations_portals__portal_id__invitations_get"];
        put?: never;
        /**
         * Invite Portal User
         * @description Invite a user to a portal with a specific role.
         */
        post: operations["invite_portal_user_portals__portal_id__invitations_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Pause Portal
         * @description Pause a portal — hide from public, stop accepting orders.
         */
        post: operations["pause_portal_portals__portal_id__pause_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Products
         * @description List all products for a portal.
         */
        get: operations["list_products_portals__portal_id__products_get"];
        put?: never;
        /**
         * Create Product
         * @description Create a new product in a portal.
         */
        post: operations["create_product_portals__portal_id__products_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Product
         * @description Get a product by ID.
         */
        get: operations["get_product_portals__portal_id__products__product_id__get"];
        put?: never;
        post?: never;
        /**
         * Delete Product
         * @description Delete a product.
         */
        delete: operations["delete_product_portals__portal_id__products__product_id__delete"];
        options?: never;
        head?: never;
        /**
         * Update Product
         * @description Partially update a product.
         */
        patch: operations["update_product_portals__portal_id__products__product_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}/confirm-price": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm Product Price
         * @description Keep the published price (S87): RGI's answer to a markup-floor alert,
         *     or a plain re-confirmation. Records the decision and the buyer-visible
         *     price-confirmed date; changes no price.
         */
        post: operations["confirm_product_price_portals__portal_id__products__product_id__confirm_price_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}/inventory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Product Inventory
         * @description Get stock status for all variants of a product.
         *
         *     S74 D8 (ruling 82): URL moved under portal-scoped prefix from
         *     /products/{product_id}/inventory to
         *     /portals/{portal_id}/products/{product_id}/inventory. Pre-reshape
         *     the route had no tenant scoping at any layer (bead 0eek);
         *     verify_portal_access at entry + portal_id threaded to service
         *     closes the tenant hole.
         */
        get: operations["get_product_inventory_portals__portal_id__products__product_id__inventory_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}/inventory/{variant_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set Product Inventory
         * @description Set stock to a specific quantity (manual count override).
         *
         *     S74 D8: URL and tenant threading match adjust_product_inventory.
         */
        put: operations["set_product_inventory_portals__portal_id__products__product_id__inventory__variant_id__put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Adjust Product Inventory
         * @description Adjust stock quantity for a variant (increment/decrement).
         *
         *     S74 D8: URL and tenant threading match get_product_inventory. Pre-D8
         *     the write was reachable cross-tenant via variant_id alone (bead 0eek
         *     Block 1 update); repo.get_by_id pre-verify inside adjust_stock now
         *     enforces the tenant boundary before mutating.
         */
        patch: operations["adjust_product_inventory_portals__portal_id__products__product_id__inventory__variant_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}/variants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Variants */
        get: operations["list_variants_portals__portal_id__products__product_id__variants_get"];
        put?: never;
        /** Create Variant */
        post: operations["create_variant_portals__portal_id__products__product_id__variants_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/{product_id}/variants/{variant_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Variant */
        get: operations["get_variant_portals__portal_id__products__product_id__variants__variant_id__get"];
        put?: never;
        post?: never;
        /** Delete Variant */
        delete: operations["delete_variant_portals__portal_id__products__product_id__variants__variant_id__delete"];
        options?: never;
        head?: never;
        /** Update Variant */
        patch: operations["update_variant_portals__portal_id__products__product_id__variants__variant_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/products/category-margins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Category Margins
         * @description Default margin per category, derived from the master catalog's own
         *     cost and suggested-retail figures. Prefills the bulk-reprice screen.
         */
        get: operations["list_category_margins_portals__portal_id__products_category_margins_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Import Products
         * @description Bulk import products from a CSV file.
         *
         *     CSV columns: name, sku, description, category, base_price, sizes, colors
         *     sizes and colors are semicolon-separated (e.g. "S;M;L;XL").
         */
        post: operations["import_products_portals__portal_id__products_import_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/products/reprice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reprice Products
         * @description Bulk reprice as base_cost + margin, per category or portal-wide.
         *
         *     Defaults to a dry run that returns every old and new price and writes
         *     nothing; send ``dry_run: false`` to apply.
         */
        post: operations["reprice_products_portals__portal_id__products_reprice_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish Portal
         * @description Publish a portal (set status to active).
         */
        post: operations["publish_portal_portals__portal_id__publish_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/quotes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Quotes */
        get: operations["list_quotes_portals__portal_id__quotes_get"];
        put?: never;
        /** Create Quote */
        post: operations["create_quote_portals__portal_id__quotes_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{portal_id}/quotes/{quote_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Quote */
        get: operations["get_quote_portals__portal_id__quotes__quote_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update Quote */
        patch: operations["update_quote_portals__portal_id__quotes__quote_id__patch"];
        trace?: never;
    };
    "/portals/{portal_id}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resume Portal
         * @description Resume a paused, expired, or inactive portal.
         */
        post: operations["resume_portal_portals__portal_id__resume_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{template_id}/duplicate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Duplicate Portal
         * @description Duplicate a portal for a single location.
         */
        post: operations["duplicate_portal_portals__template_id__duplicate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/{template_id}/duplicate-batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Duplicate Portal Batch
         * @description Duplicate a portal for multiple locations in batch.
         */
        post: operations["duplicate_portal_batch_portals__template_id__duplicate_batch_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/check-slug/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check Slug Available
         * @description Check if a portal slug is available.
         */
        get: operations["check_slug_available_portals_check_slug__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/create-from-description": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create From Description
         * @description Create a complete portal from a natural language description.
         */
        post: operations["create_from_description_portals_create_from_description_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portals/lifecycle-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Lifecycle Summary
         * @description Get counts of portals by lifecycle status for the organization.
         */
        get: operations["get_lifecycle_summary_portals_lifecycle_summary_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Production Export
         * @description The production CSV by date range (D6; dispatch 17–18 Nov 2026, item
         *     3): three grains, the header exactly as the design writes it, streamed
         *     row by row, the shop's rows only; every export is audited before the
         *     first byte (who, when, grain, window).
         */
        get: operations["production_export_production_export_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/floor/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resolve Barcode
         * @description A scanned barcode, unit or line, and which (dispatch 13 Nov 2026
         *     evening, A; ruling 14 Nov 2026: the barcode is a scan code, never an
         *     id): the job ticket's names the batch, the ticket sheet's names a line
         *     of it. 404 when it names neither in this shop.
         */
        get: operations["resolve_barcode_production_floor_resolve_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/floor/scans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Last Scans
         * @description The shop's last scans, newest first (day 5, Part B); ``station``
         *     narrows to one station's.
         */
        get: operations["last_scans_production_floor_scans_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Proposals */
        get: operations["list_proposals_production_proposals_get"];
        put?: never;
        /**
         * Propose
         * @description Propose; nothing is applied. The facts present are kept with it.
         */
        post: operations["propose_production_proposals_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/proposals/{proposal_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Proposal */
        get: operations["get_proposal_production_proposals__proposal_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/proposals/{proposal_id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve
         * @description Approve and apply through the action's own service; a refusal by the
         *     action is kept on the proposal and answered 409.
         */
        post: operations["approve_production_proposals__proposal_id__approve_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/production/proposals/{proposal_id}/decline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Decline */
        post: operations["decline_production_proposals__proposal_id__decline_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proofs/{proof_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Proof
         * @description Get a proof by ID. A buyer reaches only proofs on their own orders (S86).
         *
         *     S74 D9 ruling-66 collapse: post-D9 proof_service.get_by_id enforces
         *     tenant via JOIN through DBOrder (ruling 56's INTERIM verify_order_access
         *     is now redundant on the success path — proof returned means proof is
         *     in caller's tenant). The order round-trip below is the buyer ownership
         *     check only, and answers the same 404.
         */
        get: operations["get_proof_proofs__proof_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proofs/{proof_id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Approve Proof
         * @description Approve a proof, optionally capturing a signature.
         *
         *     S74 D9 ruling-66 collapse: verify_order_access dropped — proof_service.
         *     get_by_id + .approve both enforce tenant at repo boundary via JOIN
         *     through DBOrder (ruling 56 INTERIM cleared).
         */
        post: operations["approve_proof_proofs__proof_id__approve_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/proofs/{proof_id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject Proof
         * @description Reject a proof with a reason.
         *
         *     S74 D9 ruling-66 collapse: verify_order_access dropped — same rationale
         *     as approve_proof.
         */
        post: operations["reject_proof_proofs__proof_id__reject_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Batches
         * @description Every production unit of the caller's shop as a batch (day 2, Part A):
         *     slots, orders, oldest line, state, Docket number, and the fill advice.
         *     ``q`` (D5): by batch number, PO, product, customer or ship-to.
         */
        get: operations["list_batches_release_units_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read Unit
         * @description One production unit (ruling 11 Nov 2026): the list's row for it and
         *     the Docket payload a push would send, or why it cannot be built. The
         *     per-unit read behind the shadow comparison's payload column; nothing is
         *     sent, no file or host is shown.
         */
        get: operations["read_unit_release_units__unit_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/bundle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Bundle
         * @description The latest bundle as a zip, under the push-out permission.
         */
        get: operations["download_bundle_release_units__unit_id__bundle_get"];
        put?: never;
        /**
         * Build Bundle
         * @description The release output bundle (R6/R7) built from the unit's record and
         *     stored on the unit with its sha256; the listing comes back.
         */
        post: operations["build_bundle_release_units__unit_id__bundle_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/business-entity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Override Unit Business Entity
         * @description A person's override of the unit's business entity (13 Nov 2026
         *     evening, C): an entity of the caller's shop and a reason; audited as
         *     business_entity.override. A unit or entity of another shop is 404.
         */
        post: operations["override_unit_business_entity_release_units__unit_id__business_entity_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/detail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Batch Detail */
        get: operations["batch_detail_release_units__unit_id__detail_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/half-batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Half Batch
         * @description Andrew, 6 Nov 2026: a batch at or under 12 slots used becomes a half
         *     batch (capacity 12, 125 sheets); the push still goes through the
         *     confirmation, which this answers with.
         */
        post: operations["half_batch_release_units__unit_id__half_batch_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/holds/{hold_id}/clear": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Clear Hold
         * @description §6.1: a person clears a hold with the evidence of who approved and how,
         *     and the answer where the reason has one; written back and remembered.
         */
        post: operations["clear_hold_release_units__unit_id__holds__hold_id__clear_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/holds/{hold_id}/price": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Answer Price
         * @description Bead hry5: a needs_price hold is answered with the price, under the
         *     pricing permission — the price is written to the line and the order,
         *     the hold closes as priced with who and when, the decision is kept.
         */
        post: operations["answer_price_release_units__unit_id__holds__hold_id__price_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/holds/{hold_id}/split": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Split Once
         * @description Held's one-time split (day 4, Part E): a mixed-stock or over-capacity
         *     hold answered "split this order once"; the shop rule is untouched.
         */
        post: operations["split_once_release_units__unit_id__holds__hold_id__split_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Link Unit
         * @description needs_human → released on a production group, as an assertion by a
         *     named person at a time (a docketmanager/order_number row, source person).
         */
        post: operations["link_unit_release_units__unit_id__link_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/mark-done": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark Batch Done */
        post: operations["mark_batch_done_release_units__unit_id__mark_done_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/not-found": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unit Not Found */
        post: operations["unit_not_found_release_units__unit_id__not_found_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/push-out": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Push Out
         * @description The push-out, confirmed by a person: sends only when the shop's
         *     ``docket_send_enabled`` is true and only to its configured site; every
         *     attempt is audited with the payload's sha256.
         */
        post: operations["push_out_release_units__unit_id__push_out_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/push-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Push Out Preview
         * @description What a push-out would do (day 2, Part B): the files, the blanks, the
         *     exact Docket payload, the switch's state. Nothing is sent here.
         */
        get: operations["push_out_preview_release_units__unit_id__push_preview_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Release Unit
         * @description Release: a shipment group forms its production group in releasing; a
         *     retryable production group is re-released as itself. Then the push with
         *     the production group's own id as the token; never left in releasing.
         *     Returns the order with both levels.
         */
        post: operations["release_unit_release_units__unit_id__release_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/station": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Station View
         * @description The station card for a scanned batch (day 5, Part B): its route, the
         *     expected next scan, the Docket number, whether it is held.
         */
        get: operations["station_view_release_units__unit_id__station_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/steps/{position}/arrived": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Arrived */
        post: operations["arrived_release_units__unit_id__steps__position__arrived_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/steps/{position}/done": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Done */
        post: operations["done_release_units__unit_id__steps__position__done_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/steps/{position}/hold": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Hold From Station */
        post: operations["hold_from_station_release_units__unit_id__steps__position__hold_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/{unit_id}/ticket": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Job Ticket
         * @description The unit's job ticket as PDF (Part A, 5 Nov 2026; bead 1elb): the
         *     latest generated, or a new one when none exists or ``regenerate`` is set.
         *     Both variants sit behind the push-out permission; the priced variant is
         *     for the office. The response carries the file's sha256.
         */
        get: operations["job_ticket_release_units__unit_id__ticket_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/move-lines": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move Lines
         * @description §7 override under the freeze (§8.4): refused on a frozen group for every role.
         */
        post: operations["move_lines_release_units_move_lines_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/orders/{order_id}/cancel-held": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel Held Units
         * @description E.5 partial cancellation: the order's held, unfrozen shipment groups, with a reason.
         */
        post: operations["cancel_held_units_release_units_orders__order_id__cancel_held_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/release-units/queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Held Queue
         * @description Every unit not released or cancelled, with its age and, on each open
         *     hold, the prior decision on the same case (H v3 §5.4, §6.2). Dispatch 16
         *     Nov 2026 (item 5): the shadow_reader reads it too — the Held screen is a
         *     read of this list; every action on a hold stays ORDER_RELEASE.
         */
        get: operations["held_queue_release_units_queue_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scrape/website": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Scrape Website
         * @description Scrape a website for brand information (logo, colors, description, industry).
         */
        post: operations["scrape_website_scrape_website_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/mis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Mis Settings
         * @description Get current MIS configuration for the organization.
         */
        get: operations["get_mis_settings_settings_mis_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Mis Settings
         * @description Update MIS provider and configuration.
         */
        patch: operations["update_mis_settings_settings_mis_patch"];
        trace?: never;
    };
    "/settings/mis/test-connection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Test Mis Connection
         * @description Test connectivity to the configured MIS.
         */
        post: operations["test_mis_connection_settings_mis_test_connection_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shipping/purchase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Purchase Label
         * @description Purchase a shipping label for an order.
         */
        post: operations["purchase_label_shipping_purchase_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shipping/rates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get Rates
         * @description Get shipping rate options for an order.
         */
        post: operations["get_rates_shipping_rates_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/shipping/tracking/{tracking_number}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Tracking
         * @description Get tracking status for one of the caller's shipments.
         *
         *     S87 (exposure cop R3): the number must be on an order in the caller's
         *     organisation — and, for a buyer, on their own order. Any other number is
         *     404, so the carrier lookup never serves another tenant's shipment.
         */
        get: operations["get_tracking_shipping_tracking__tracking_number__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Library */
        get: operations["list_library_spec_library_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library/{product_key}/assert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Correct Stock */
        post: operations["correct_stock_spec_library__product_key__assert_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library/{product_key}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Product History */
        get: operations["product_history_spec_library__product_key__history_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library/{product_key}/not-batched": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark Not Batched */
        post: operations["mark_not_batched_spec_library__product_key__not_batched_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library/{product_key}/suggest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Product Suggestion
         * @description What a stock_unknown hold shows: the library row in force, the docket
         *     proposals, and the history's evidence rows — with the same customer's
         *     other products (``portal_id``) and the description's matches.
         */
        get: operations["product_suggestion_spec_library__product_key__suggest_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/spec-library/import": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Import Spec Rows
         * @description Ruling 11 Nov 2026 (shadow in the sandbox shop): Andrew's stock per
         *     product, from his history.db / Stock window, into the caller's shop's spec
         *     library as ``source=import`` with the evidence given. Nothing is
         *     hard-coded: the rows come in the body (``scripts/build_spec_import.py``
         *     builds them from a copy of history.db). ``dry_run`` (the default) lists
         *     every decision and writes nothing; a key with a row already in force is
         *     never overridden.
         */
        post: operations["import_spec_rows_spec_library_import_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stocked-goods/units": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Units
         * @description The shop's stocked-goods units, oldest first, with their picked state
         *     and shipping row. Staff only this rev: the shadow reader's three routes
         *     are pinned by ruling (#265, 18 Nov 2026) and by test; a fourth is a
         *     ruling, not a side effect (dispatch 23 Nov, design question).
         */
        get: operations["list_units_stocked_goods_units_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stocked-goods/units/{unit_id}/mark-picked": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark Picked
         * @description Two steps: confirm false is the plan and writes nothing; confirm true
         *     marks the unit picked, writes its shipping row and the audit row.
         */
        post: operations["mark_picked_stocked_goods_units__unit_id__mark_picked_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stocked-goods/units/{unit_id}/shipping-csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download Shipping Csv
         * @description The unit's shipping row as the ALLORDER CSV, once written.
         */
        get: operations["download_shipping_csv_stocked_goods_units__unit_id__shipping_csv_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stripe/connect/onboarding": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create Onboarding Link
         * @description Create a Stripe Connect onboarding link for the user's organization.
         */
        post: operations["create_onboarding_link_stripe_connect_onboarding_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stripe/connect/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Stripe Status
         * @description Check the Stripe Connect status for the user's organization.
         */
        get: operations["get_stripe_status_stripe_connect_status_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Invitations
         * @description List all invitations for the organization.
         */
        get: operations["list_invitations_team_invitations_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invitations/{invitation_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke Invitation
         * @description Revoke a pending invitation.
         */
        delete: operations["revoke_invitation_team_invitations__invitation_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invitations/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Accept Invitation
         * @description Accept an invitation and join the organization. Token in the body.
         */
        post: operations["accept_invitation_team_invitations_accept_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invitations/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Preview Invitation
         * @description What the accept page shows before sign-in. Public by bearer token (S86).
         *     A POST with the token in the body: a path or query token is written to
         *     every access log on the way in (bead nt7z).
         */
        post: operations["preview_invitation_team_invitations_preview_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invitations/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register From Invitation
         * @description Set a password and take up the invitation: the user is created with only
         *     the invited role in the inviting organisation; no organisation is created
         *     (S86, the proper invited-buyer path). The session is answered like sign-in:
         *     refresh token in the cookie, access token in the body (item 6).
         */
        post: operations["register_from_invitation_team_invitations_register_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Invite Member
         * @description Send an invitation to join the organization.
         */
        post: operations["invite_member_team_invite_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Members
         * @description List all members of the current user's organization.
         */
        get: operations["list_members_team_members_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/team/members/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Member
         * @description Get details of a specific team member.
         */
        get: operations["get_member_team_members__user_id__get"];
        put?: never;
        post?: never;
        /**
         * Remove Member
         * @description Remove a member from the organization.
         */
        delete: operations["remove_member_team_members__user_id__delete"];
        options?: never;
        head?: never;
        /**
         * Update Member
         * @description Update a team member's role, portal assignments, or reporting structure.
         */
        patch: operations["update_member_team_members__user_id__patch"];
        trace?: never;
    };
    "/uploads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload File
         * @description Upload a file (image or PDF) and return its URL.
         */
        post: operations["upload_file_uploads_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/docketmanager/{organization_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Handle Dm Webhook
         * @description Process a DocketManager queue transition webhook.
         *
         *     Auth: X-DM-Signature header carrying "sha256=<hex>" HMAC of the raw body.
         *     Verified inside the service against the target org's configured
         *     webhook_secret with constant-time comparison. See ``ay07`` bead body for
         *     the sub-defect enumeration and threat model.
         */
        post: operations["handle_dm_webhook_webhooks_docketmanager__organization_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/stripe/connect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stripe Webhook
         * @description Handle Stripe webhook events. No auth — uses Stripe signature verification.
         */
        post: operations["stripe_webhook_webhooks_stripe_connect_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/twilio/sms/{organization_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Receive Sms
         * @description Receive inbound SMS from Twilio.
         *
         *     Twilio sends a POST with form-encoded body to this endpoint when an
         *     SMS is received on the configured phone number. Auth is HMAC-SHA1
         *     signature verification against the reconstructed URL and form params.
         *
         *     Rejection paths (all 403 per Twilio convention; see g8c3 for the
         *     401-vs-403 choice rationale):
         *
         *     * ``SMS_TWILIO_AUTH_TOKEN`` unconfigured (None or empty) → 403
         *       (fail-closed per ruling 13/21; empty key would make HMAC trivially
         *       forgeable).
         *     * ``X-Twilio-Signature`` header absent → 403.
         *     * ``X-Forwarded-Proto`` or ``X-Forwarded-Host`` header absent → 403
         *       (fail-closed per ruling 19; cannot reconstruct the URL Twilio
         *       signed against; do NOT silently fall back to ``request.url``).
         *     * HMAC-SHA1 signature does not match → 403.
         *
         *     Path-``organization_id`` is trusted only that it was included in the
         *     URL Twilio POSTed to (which is a URL WE configured for the phone in
         *     Twilio's console). No independent org-oracle exists at pilot; see the
         *     module docstring and ``t7i8`` for the routing architecture gap.
         */
        post: operations["receive_sms_webhooks_twilio_sms__organization_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** ActionProposal */
        ActionProposal: {
            category?: components["schemas"]["PushAloneReason"] | null;
            /** Decided At */
            decided_at?: string | null;
            /** Decided By */
            decided_by?: string | null;
            /** Decision Context Id */
            decision_context_id?: string | null;
            /**
             * Decision Note
             * @default
             */
            decision_note: string;
            facts: components["schemas"]["ActionProposalFacts"];
            /**
             * Failure
             * @default
             */
            failure: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            kind: components["schemas"]["ActionProposalKind"];
            /**
             * Note
             * @default
             */
            note: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Proposed At
             * Format: date-time
             */
            proposed_at: string;
            /** Proposed By */
            proposed_by?: string | null;
            /** Reason */
            reason: string;
            /** Result */
            result?: components["schemas"]["VoidOrderResult"] | components["schemas"]["PushAloneResult"] | components["schemas"]["MarkDoneResult"] | components["schemas"]["PushOutPreview"] | null;
            status: components["schemas"]["ActionProposalStatus"];
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["ActionProposalTarget"];
        };
        /**
         * ActionProposalFacts
         * @description The facts present at the moment of the proposal — what the person
         *     saw — kept beside the decision (Andrew, 13 Nov 2026, finding 9).
         */
        ActionProposalFacts: {
            /** Business Entity Id */
            business_entity_id?: string | null;
            /** Capacity */
            capacity?: number | null;
            /**
             * Captured At
             * Format: date-time
             */
            captured_at: string;
            /**
             * Cards
             * @default 0
             */
            cards: number;
            /**
             * Channel
             * @default
             */
            channel: string;
            /**
             * Customer
             * @default
             */
            customer: string;
            /**
             * Half
             * @default false
             */
            half: boolean;
            /**
             * Lines
             * @default 0
             */
            lines: number;
            /** Lines Moving */
            lines_moving?: components["schemas"]["MovedLineFact"][];
            /** Open Holds */
            open_holds?: string[];
            /**
             * Order Status
             * @default
             */
            order_status: string;
            /** Portal Id */
            portal_id?: string | null;
            /**
             * Reference
             * @default
             */
            reference: string;
            /** Slots Kept */
            slots_kept?: number | null;
            /** Slots Used */
            slots_used?: number | null;
            /**
             * Stock
             * @default
             */
            stock: string;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["ActionProposalTarget"];
            /** Units */
            units?: components["schemas"]["ProposalUnitFact"][];
        };
        /**
         * ActionProposalKind
         * @description A production action a person proposes and another step approves
         *     (dispatch 17 Nov 2026, item 3; Andrew's behaviours of 6 Nov as the
         *     actions). Nothing applies at proposal; approval runs the existing
         *     action through its own service, and the push to Docket stays behind
         *     the push-out confirmation that already exists.
         * @enum {string}
         */
        ActionProposalKind: "push_short_run" | "push_alone" | "void_order" | "mark_done";
        /**
         * ActionProposalStatus
         * @enum {string}
         */
        ActionProposalStatus: "proposed" | "approved" | "declined" | "failed" | "withdrawn";
        /**
         * ActionProposalTarget
         * @enum {string}
         */
        ActionProposalTarget: "order" | "release_unit";
        /**
         * ActionType
         * @enum {string}
         */
        ActionType: "message" | "email" | "escalation";
        /** ActivityFeedResponse */
        ActivityFeedResponse: {
            /** Activities */
            activities: components["schemas"]["ActivityRecord"][];
            /** Average Order Value */
            average_order_value: number;
            /** Portal Name */
            portal_name?: string | null;
            /** Total Orders */
            total_orders: number;
            /** Total Revenue */
            total_revenue: number;
            /** User Email */
            user_email?: string | null;
            /** User Id */
            user_id: string;
        };
        /** ActivityMessageDetails */
        ActivityMessageDetails: {
            /** Channel */
            channel: string;
            /** Direction */
            direction: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "message";
        };
        /** ActivityOrderItem */
        ActivityOrderItem: {
            /** Product */
            product: string;
            /** Qty */
            qty: number;
            /** Total */
            total: number;
        };
        /** ActivityOrderPlacedDetails */
        ActivityOrderPlacedDetails: {
            /** Items */
            items?: components["schemas"]["ActivityOrderItem"][];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "order_placed";
        };
        /** ActivityRecord */
        ActivityRecord: {
            activity_type: components["schemas"]["ActivityType"];
            /** Amount */
            amount?: number | null;
            /** Details */
            details?: (components["schemas"]["ActivityOrderPlacedDetails"] | components["schemas"]["ActivityMessageDetails"]) | null;
            /** Order Id */
            order_id?: string | null;
            /** Order Number */
            order_number?: string | null;
            /** Status */
            status?: string | null;
            /** Summary */
            summary: string;
            /** Timestamp */
            timestamp: string;
        };
        /**
         * ActivityType
         * @enum {string}
         */
        ActivityType: "order.placed" | "order.status_changed" | "order.cancelled" | "proof.submitted" | "proof.approved" | "proof.rejected" | "message.received" | "message.sent";
        /** AddOrganizationEquipmentRequest */
        AddOrganizationEquipmentRequest: {
            /**
             * Equipment Id
             * Format: uuid
             */
            equipment_id: string;
            /** Notes */
            notes?: string | null;
            /**
             * Quantity
             * @default 1
             */
            quantity: number;
        };
        /** AddToCartRequest */
        AddToCartRequest: {
            /** Artwork Change Note */
            artwork_change_note?: string | null;
            artwork_disposition?: components["schemas"]["ArtworkDisposition"] | null;
            /** Artwork Upload Url */
            artwork_upload_url?: string | null;
            /** Color */
            color?: string | null;
            /** Options */
            options?: {
                [key: string]: unknown;
            } | null;
            /** Price Option */
            price_option?: string | null;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /**
             * Quantity
             * @default 1
             */
            quantity: number;
            /** Recipients */
            recipients?: components["schemas"]["RecipientInput"][] | null;
            /** Size */
            size?: string | null;
            /** Unit Price */
            unit_price?: number | string | null;
        };
        /**
         * AdjustStockRequest
         * @description Request to adjust stock quantity.
         */
        AdjustStockRequest: {
            /**
             * Quantity Change
             * @description Positive to add, negative to subtract
             */
            quantity_change: number;
            /** Reason */
            reason: string;
        };
        /**
         * AdminActionResult
         * @description What the applied act did; kept on the proposal.
         */
        AdminActionResult: {
            /**
             * Applied At
             * Format: date-time
             */
            applied_at: string;
            /** Invitation Id */
            invitation_id?: string | null;
            kind: components["schemas"]["AdminProposalKind"];
            /** Role After */
            role_after?: string[];
            /** Role Before */
            role_before?: string[];
            /**
             * Roles Removed
             * @default 0
             */
            roles_removed: number;
            /**
             * Sessions Revoked
             * @default 0
             */
            sessions_revoked: number;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
        };
        /** AdminInvitationFacts */
        AdminInvitationFacts: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /**
             * Invitation Id
             * Format: uuid
             */
            invitation_id: string;
            /** Invited Email */
            invited_email: string;
            /** Portal Ids */
            portal_ids?: string[];
            /** Role */
            role: string;
            /** State */
            state: string;
        };
        /**
         * AdminMember
         * @description A member as the admin page shows them (team:manage): the team row plus
         *     whether the account is active, the last sign-in and the open sessions —
         *     never IPs, devices or session details.
         */
        AdminMember: {
            /**
             * Assigned At
             * Format: date-time
             */
            assigned_at: string;
            /** Display Name */
            display_name?: string | null;
            /** Email */
            email: string;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Last Sign In At */
            last_sign_in_at?: string | null;
            /**
             * Open Sessions
             * @default 0
             */
            open_sessions: number;
            /** Portal Assignments */
            portal_assignments?: components["schemas"]["PortalAssignment"][];
            /** Reports To */
            reports_to?: string | null;
            /** Roles */
            roles?: string[];
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /**
         * AdminMemberFacts
         * @description The member as they stood when the proposal was made.
         */
        AdminMemberFacts: {
            /** Display Name */
            display_name?: string | null;
            /** Email */
            email: string;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Last Sign In At */
            last_sign_in_at?: string | null;
            /**
             * Open Sessions
             * @default 0
             */
            open_sessions: number;
            /** Roles */
            roles?: string[];
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** AdminProposal */
        AdminProposal: {
            /** Decided At */
            decided_at?: string | null;
            /** Decided By */
            decided_by?: string | null;
            /**
             * Decision Note
             * @default
             */
            decision_note: string;
            facts: components["schemas"]["AdminProposalFacts"];
            /**
             * Failure
             * @default
             */
            failure: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            kind: components["schemas"]["AdminProposalKind"];
            /** New Role */
            new_role?: string | null;
            /**
             * Note
             * @default
             */
            note: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Proposed At
             * Format: date-time
             */
            proposed_at: string;
            /** Proposed By */
            proposed_by?: string | null;
            /** Reason */
            reason: string;
            result?: components["schemas"]["AdminActionResult"] | null;
            status: components["schemas"]["ActionProposalStatus"];
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["AdminProposalTarget"];
        };
        /** AdminProposalFacts */
        AdminProposalFacts: {
            /**
             * Captured At
             * Format: date-time
             */
            captured_at: string;
            invitation?: components["schemas"]["AdminInvitationFacts"] | null;
            member?: components["schemas"]["AdminMemberFacts"] | null;
            /** New Role */
            new_role?: string | null;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["AdminProposalTarget"];
        };
        /**
         * AdminProposalKind
         * @description The admin family of the same ledger (t03, ruled 19 Nov 2026): an act
         *     on a member or an invitation of the shop, proposed by a team manager
         *     with a reason and applied only on approval. Never on oneself; never on
         *     the shop's last printer_admin (remove, deactivate, demote).
         * @enum {string}
         */
        AdminProposalKind: "deactivate_member" | "reactivate_member" | "remove_member" | "change_role" | "resend_invitation" | "revoke_invitation";
        /**
         * AdminProposalTarget
         * @enum {string}
         */
        AdminProposalTarget: "member" | "invitation";
        /**
         * AdminSettings
         * @description The two second-approver switches, both default off (ruled 19 Nov
         *     2026): the floor's on press_run_config, the admin acts' on the
         *     organisation.
         */
        AdminSettings: {
            /**
             * Require Second Approver Admin
             * @default false
             */
            require_second_approver_admin: boolean;
            /**
             * Require Second Approver Floor
             * @default false
             */
            require_second_approver_floor: boolean;
        };
        /**
         * AgentActivityEvent
         * @description A single agent activity audit event.
         */
        AgentActivityEvent: {
            /** Action */
            action: string;
            /** Details */
            details: {
                [key: string]: unknown;
            } | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Resource Id */
            resource_id: string | null;
            /** Resource Type */
            resource_type: string | null;
            /**
             * Timestamp
             * Format: date-time
             */
            timestamp: string;
            /** User Id */
            user_id: string | null;
        };
        /**
         * AgentActivityResponse
         * @description Paginated agent activity response.
         */
        AgentActivityResponse: {
            /** Events */
            events: components["schemas"]["AgentActivityEvent"][];
            /** Limit */
            limit: number;
            /** Offset */
            offset: number;
            /** Total */
            total: number;
        };
        /**
         * AgentConfiguration
         * @description Pydantic representation of an org's agent configuration.
         */
        AgentConfiguration: {
            /** Allowed Topics */
            allowed_topics: string[];
            /** Auto Pass Enabled */
            auto_pass_enabled: boolean;
            /** Byok Anthropic Key Ref */
            byok_anthropic_key_ref: string | null;
            /** Byok Openai Key Ref */
            byok_openai_key_ref: string | null;
            /** Copyright Screening Enabled */
            copyright_screening_enabled: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Emergency Stop Activated At */
            emergency_stop_activated_at: string | null;
            /** Emergency Stop Activated By Id */
            emergency_stop_activated_by_id: string | null;
            /** Emergency Stop Active */
            emergency_stop_active: boolean;
            /** Escalation Confidence Threshold */
            escalation_confidence_threshold: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Incident Alert Level */
            incident_alert_level: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Profanity Handling */
            profanity_handling: string;
            qa_mode: components["schemas"]["QAMode"];
            /** Tone Setting */
            tone_setting: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * AgentControlMetrics
         * @description Aggregate metrics for the agent control center dashboard.
         */
        AgentControlMetrics: {
            /** Avg Resolution Hours */
            avg_resolution_hours: number | null;
            /** Escalation Count */
            escalation_count: number;
            /** Escalation Rate */
            escalation_rate: number;
            /** Tasks By Status */
            tasks_by_status: components["schemas"]["AgentStatusCount"][];
            /** Total Tasks */
            total_tasks: number;
        };
        /**
         * AgentFeedbackResponse
         * @description Full feedback record response.
         */
        AgentFeedbackResponse: {
            /** Agent Id */
            agent_id: string;
            /** Agent Task Id */
            agent_task_id?: string | null;
            /** Category */
            category?: string | null;
            /** Corrected Output */
            corrected_output?: {
                [key: string]: unknown;
            } | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Feedback Type */
            feedback_type: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Implicit */
            implicit: boolean;
            /** Notes */
            notes?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Original Output */
            original_output?: {
                [key: string]: unknown;
            } | null;
            /** Portal Id */
            portal_id?: string | null;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /**
         * AgentFeedbackStat
         * @description Per-agent feedback statistics.
         */
        AgentFeedbackStat: {
            /** Agent Id */
            agent_id: string;
            /** Signal Count */
            signal_count: number;
            /** Thumbs Down */
            thumbs_down: number;
            /** Thumbs Up */
            thumbs_up: number;
            /** Thumbs Up Rate */
            thumbs_up_rate: number;
            /** Top Issue */
            top_issue?: string | null;
        };
        /**
         * AgentPerformanceDetail
         * @description Detailed feedback stats for a single agent.
         */
        AgentPerformanceDetail: {
            /** Agent Id */
            agent_id: string;
            /** Recent Feedback */
            recent_feedback: components["schemas"]["AgentFeedbackResponse"][];
            /** Signal Count */
            signal_count: number;
            /** Thumbs Down */
            thumbs_down: number;
            /** Thumbs Up */
            thumbs_up: number;
            /** Thumbs Up Rate */
            thumbs_up_rate: number;
            /** Top Issue */
            top_issue?: string | null;
        };
        /**
         * AgentStatusCount
         * @description Task count for a single status.
         */
        AgentStatusCount: {
            /** Count */
            count: number;
            /** Status */
            status: string;
        };
        /**
         * AgentTask
         * @description Pydantic representation of an agent task.
         */
        AgentTask: {
            /** Agent Type */
            agent_type: string;
            /** Assigned To */
            assigned_to: string | null;
            /** Channel */
            channel: string | null;
            /** Completed At */
            completed_at: string | null;
            /** Confidence Score */
            confidence_score: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Error Message */
            error_message: string | null;
            /** Escalation Reason */
            escalation_reason: string | null;
            /** External Ref */
            external_ref: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Initiated By */
            initiated_by: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Portal Id */
            portal_id: string | null;
            state: components["schemas"]["AgentTaskState"] | null;
            /** Status */
            status: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * AgentTaskState
         * @description Full agent state snapshot for HITL takeover.
         *
         *     When a human takes over an agent task, this captures everything
         *     needed to resume where the agent left off.
         */
        AgentTaskState: {
            /**
             * Channel Info
             * @default {}
             */
            channel_info: {
                [key: string]: unknown;
            };
            /**
             * Context Variables
             * @default {}
             */
            context_variables: {
                [key: string]: unknown;
            };
            /**
             * Conversation History
             * @default []
             */
            conversation_history: {
                [key: string]: unknown;
            }[];
            /**
             * Decisions Made
             * @default []
             */
            decisions_made: {
                [key: string]: unknown;
            }[];
            /** Draft Response */
            draft_response?: string | null;
            /**
             * Pending Actions
             * @default []
             */
            pending_actions: {
                [key: string]: unknown;
            }[];
            /**
             * Working Files
             * @default []
             */
            working_files: string[];
        };
        /**
         * AgentTaskStatus
         * @description Lifecycle states for an agent task.
         * @enum {string}
         */
        AgentTaskStatus: "pending" | "in_progress" | "awaiting_human" | "awaiting_review" | "escalated" | "completed" | "failed" | "cancelled";
        /** ApplyPlaybookBody */
        ApplyPlaybookBody: {
            /**
             * Budget Tier
             * @default standard
             */
            budget_tier: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Scale Value */
            scale_value: number;
        };
        /**
         * ApplyPlaybookResult
         * @description Result of applying a playbook to a portal.
         */
        ApplyPlaybookResult: {
            /** Categories Created */
            categories_created: number;
            /** Created Products */
            created_products?: components["schemas"]["PlaybookCreatedProduct"][];
            /**
             * Playbook Id
             * Format: uuid
             */
            playbook_id: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Products Created */
            products_created: number;
            /** Timeline */
            timeline?: {
                [key: string]: unknown;
            }[] | null;
            /** Total Budget */
            total_budget: number;
        };
        /**
         * ApproveDraftRequest
         * @description Optional operator-edited body for the approve-draft endpoint.
         *
         *     If body is provided, it replaces the agent's draft for this send.
         *     state.draft_response is preserved for audit comparison.
         */
        ApproveDraftRequest: {
            /** Body */
            body?: string | null;
        };
        /** ApproveProofRequest */
        ApproveProofRequest: {
            /** Approved By Name */
            approved_by_name?: string | null;
            /** Signature Data */
            signature_data?: string | null;
        };
        /**
         * ArtSource
         * @description Where a line's art comes from (art provenance, dispatch 14 Nov 2026,
         *     item 3): the channel supplied it (Taylor's URL, PageDNA's link, Inspire's
         *     File Url — the channel's artefact, fetched onto the line), the shop holds
         *     it (a portal product's own file, the approved proof, or the shop's art
         *     library for a customer that keeps its art with the shop), or it is still
         *     needed (no file on the line yet — the planner's ``art_missing`` hold, or
         *     SORT once the screen exists).
         * @enum {string}
         */
        ArtSource: "channel_supplied" | "shop_held" | "needed";
        /**
         * ArtState
         * @enum {string}
         */
        ArtState: "missing" | "fetched" | "hold" | "not_needed";
        /**
         * ArtworkDisposition
         * @description What the buyer declared about a line's artwork at order time (S88).
         *
         *     Decides the proof: ``changes_new_proof`` needs one, the others do not.
         *     Default comes from the portal's order history for the product (a hotel
         *     that has ordered it before reprints unchanged), never from whether an
         *     imported proof exists.
         * @enum {string}
         */
        ArtworkDisposition: "reuse_unchanged" | "changes_new_proof" | "no_artwork" | "channel_file" | "channel_file_ambiguous";
        /** AuditLogEntry */
        AuditLogEntry: {
            /** Action */
            action: string;
            /** Correlation Id */
            correlation_id: string | null;
            /** Details */
            details: {
                [key: string]: unknown;
            } | null;
            /** Id */
            id: string;
            /** Ip Address */
            ip_address: string | null;
            /** Organization Id */
            organization_id: string | null;
            /** Resource Id */
            resource_id: string | null;
            /** Resource Type */
            resource_type: string | null;
            /** Timestamp */
            timestamp: string;
            /** User Id */
            user_id: string | null;
        };
        /** AuditTrailPage */
        AuditTrailPage: {
            /** Items */
            items: components["schemas"]["AuditLogEntry"][];
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total */
            total: number;
        };
        /**
         * AutoContext
         * @description Escalation auto-context: bounded server-known fields + nested
         *     HandoffPackage for the design-handoff flow + extra="allow" for arbitrary
         *     FE pass-through (browser, viewport, etc.).
         */
        "AutoContext-Input": {
            /** Agent Context */
            agent_context?: {
                [key: string]: unknown;
            } | null;
            /** Agent Task Id */
            agent_task_id?: string | null;
            /** Assembled At */
            assembled_at?: string | null;
            handoff_package?: components["schemas"]["HandoffPackage-Input"] | null;
            /** Order Details */
            order_details?: {
                [key: string]: unknown;
            } | null;
            /** Order Id */
            order_id?: string | null;
            /** Page Context */
            page_context?: string | null;
        } & {
            [key: string]: unknown;
        };
        /**
         * AutoContext
         * @description Escalation auto-context: bounded server-known fields + nested
         *     HandoffPackage for the design-handoff flow + extra="allow" for arbitrary
         *     FE pass-through (browser, viewport, etc.).
         */
        "AutoContext-Output": {
            /** Agent Context */
            agent_context?: {
                [key: string]: unknown;
            } | null;
            /** Agent Task Id */
            agent_task_id?: string | null;
            /** Assembled At */
            assembled_at?: string | null;
            handoff_package?: components["schemas"]["HandoffPackage-Output"] | null;
            /** Order Details */
            order_details?: {
                [key: string]: unknown;
            } | null;
            /** Order Id */
            order_id?: string | null;
            /** Page Context */
            page_context?: string | null;
        } & {
            [key: string]: unknown;
        };
        /**
         * BarcodeKind
         * @description What a scanned barcode names (dispatch 13 Nov 2026 evening, A; ruling
         *     14 Nov 2026, FLAG 4): the job ticket's barcode is the production unit's
         *     scan code; the ticket sheet's, one per card, is a line's scan code.
         * @enum {string}
         */
        BarcodeKind: "unit" | "line";
        /**
         * BarcodeResolution
         * @description A scanned barcode resolved within the caller's shop: which kind it is,
         *     the scan code as stored, the batch it belongs to, and for a line its
         *     order's number and channel reference (the Taylor PO and the like). A unit
         *     barcode names no line, so the line fields are absent for it.
         */
        BarcodeResolution: {
            /** Batch Label */
            batch_label: string;
            kind: components["schemas"]["BarcodeKind"];
            /** Line Item Id */
            line_item_id?: string | null;
            /** Order Number */
            order_number?: string | null;
            /** Reference */
            reference?: string | null;
            /** Scan Code */
            scan_code: string;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** BatchDetail */
        BatchDetail: {
            /** Orders */
            orders?: components["schemas"]["BatchOrderDetail"][];
            summary: components["schemas"]["BatchSummary"];
        };
        /** BatchOrderDetail */
        BatchOrderDetail: {
            /**
             * Customer
             * @default
             */
            customer: string;
            /** Lines */
            lines?: components["schemas"]["BatchOrderLine"][];
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Order Ref */
            order_ref: string;
            /** Ship To */
            ship_to?: string[];
        };
        /** BatchOrderLine */
        BatchOrderLine: {
            /** Cards */
            cards: number;
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /** Pack Size */
            pack_size: number;
            /** Product */
            product: string;
            /** Quantity */
            quantity: number;
        };
        /**
         * BatchSummary
         * @description One production unit as the Batches screen shows it (day 2, Part A):
         *     the slot strip, who is in it, how old, where it stands, and the advice.
         *     Ruling 11 Nov 2026 (bead z2ke): the list is press-run units — their
         *     ``ordinal`` is the engine's batch number. A per-order production unit
         *     (the hotel-portal path) is not a batch: it appears only when asked for
         *     (``include_per_order``), with ``batch_number`` None and ``label`` the
         *     order's reference; a press-run unit's ``label`` is "Batch <n>".
         */
        BatchSummary: {
            /** Batch Number */
            batch_number: number | null;
            /** Blanks */
            blanks: number;
            /** Business Entities */
            business_entities?: string[];
            /**
             * Cancelled
             * @default false
             */
            cancelled: boolean;
            /** Capacity */
            capacity: number;
            /** Channel */
            channel: string;
            /** Channels */
            channels?: string[];
            /** Docket Number */
            docket_number?: string | null;
            /** Fill Candidates */
            fill_candidates?: components["schemas"]["FillCandidateSummary"][];
            /**
             * Fillable Slots
             * @default 0
             */
            fillable_slots: number;
            /** Full */
            full: boolean;
            /**
             * Half
             * @default false
             */
            half: boolean;
            /** Label */
            label: string;
            /** Line Item Ids */
            line_item_ids?: string[];
            /** Lines */
            lines: number;
            /** Marked Done At */
            marked_done_at?: string | null;
            /** Marked Done By Id */
            marked_done_by_id?: string | null;
            /** Oldest Line Age Seconds */
            oldest_line_age_seconds?: number | null;
            /** Oldest Line Ref */
            oldest_line_ref?: string | null;
            /** Orders */
            orders: number;
            /** Release State */
            release_state?: string | null;
            /** Released At */
            released_at?: string | null;
            /** Released By Id */
            released_by_id?: string | null;
            /**
             * Scan Code
             * @default
             */
            scan_code: string;
            /** Stock */
            stock: string;
            /** Tags */
            tags?: string[];
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
            /** Used */
            used: number;
        };
        /**
         * BinderySpec
         * @description Bindery equipment — booklet makers, guillotine cutters, etc.
         *
         *     Covers enum ``bindery``. Seed data has 2 populated records
         *     (Booklet Maker, Hydraulic Guillotine Cutter 40"/54"). Fields
         *     promoted here from the stub classification during Gate 2A-3
         *     after Phase 1 cross-check surfaced the populated records — see
         *     bead decision 1, SCHEMA COVERAGE CORRECTION note.
         *
         *     ``cutting_widths_mm`` follows the H-3 metric-canonical pattern.
         *     The Hydraulic Guillotine's imperial ``[40, 54]`` inches migrates
         *     to ``[1016.0, 1371.6]`` mm with ``cutting_widths_common_name``
         *     preserving ``"40 in / 54 in"``.
         */
        BinderySpec: {
            /** Binding Type */
            binding_type?: string | null;
            /** Cutting Widths Common Name */
            cutting_widths_common_name?: string | null;
            /** Cutting Widths Mm */
            cutting_widths_mm?: number[];
            /** Drive Type */
            drive_type?: string | null;
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /** Body_check_asset_quality_portals__portal_id__brand_assets__asset_id__check_quality_post */
        Body_check_asset_quality_portals__portal_id__brand_assets__asset_id__check_quality_post: {
            /** File */
            file?: string | null;
        };
        /** Body_import_products_portals__portal_id__products_import_post */
        Body_import_products_portals__portal_id__products_import_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_receive_sms_webhooks_twilio_sms__organization_id__post */
        Body_receive_sms_webhooks_twilio_sms__organization_id__post: {
            /** Body */
            Body: string;
            /** From */
            From: string;
            /** Messagesid */
            MessageSid?: string;
            /** To */
            To: string;
        };
        /** Body_upload_brand_asset_portals__portal_id__brand_assets_post */
        Body_upload_brand_asset_portals__portal_id__brand_assets_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_file_uploads_post */
        Body_upload_file_uploads_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_import_file_import_upload_post */
        Body_upload_import_file_import_upload_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_onboarding_document_onboarding_upload_document_post */
        Body_upload_onboarding_document_onboarding_upload_document_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_order_file_orders__order_id__files_post */
        Body_upload_order_file_orders__order_id__files_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /**
         * BrandAssetResponse
         * @description Response schema for a brand asset.
         */
        BrandAssetResponse: {
            /** Asset Type */
            asset_type: string;
            /** Auto Scraped */
            auto_scraped: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** File Format */
            file_format: string;
            /** File Name */
            file_name: string;
            /** File Size Bytes */
            file_size_bytes: number;
            /** File Url */
            file_url: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Current */
            is_current: boolean;
            /** Metadata Json */
            metadata_json?: {
                [key: string]: unknown;
            } | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Quality Details */
            quality_details?: (components["schemas"]["RasterQualityDetails"] | components["schemas"]["SvgQualityDetails"] | components["schemas"]["UnsupportedFormatDetails"]) | null;
            /** Quality Status */
            quality_status: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Uploaded By Id */
            uploaded_by_id?: string | null;
            /** Version */
            version: number;
        };
        /**
         * BrandAssetsFound
         * @description Brand assets discovered during a store creation flow.
         */
        BrandAssetsFound: {
            /** Colors */
            colors?: string[];
            /** Industry */
            industry?: string | null;
            /**
             * Logo
             * @default false
             */
            logo: boolean;
        };
        /**
         * BrandAssetUpdate
         * @description Request schema for updating a brand asset.
         */
        BrandAssetUpdate: {
            /** Asset Type */
            asset_type?: string | null;
            /** Metadata Json */
            metadata_json?: {
                [key: string]: unknown;
            } | null;
            /** Quality Status */
            quality_status?: string | null;
        };
        /** BrandColors */
        BrandColors: {
            /** Accent */
            accent?: string | null;
            /** Primary */
            primary?: string | null;
            /** Quaternary */
            quaternary?: string | null;
            /** Secondary */
            secondary?: string | null;
            /** Tertiary */
            tertiary?: string | null;
        };
        /**
         * BrandConfig
         * @description Portal brand configuration stored as JSONB.
         */
        BrandConfig: {
            /** Accent Color */
            accent_color?: string | null;
            /** Banner Image Url */
            banner_image_url?: string | null;
            /** Favicon Url */
            favicon_url?: string | null;
            /** Logo Url */
            logo_url?: string | null;
            /**
             * Powered By Teaky
             * @default true
             */
            powered_by_teaky: boolean;
            /** Primary Color */
            primary_color?: string | null;
            /** Secondary Color */
            secondary_color?: string | null;
            /** Support Email */
            support_email?: string | null;
            /** Support Name */
            support_name?: string | null;
            /** Support Phone */
            support_phone?: string | null;
        };
        /**
         * BrandData
         * @description Brand data scraped or inferred from a company's web presence.
         */
        BrandData: {
            /** Colors */
            colors?: string[];
            /** Company Name */
            company_name?: string | null;
            /** Description */
            description?: string | null;
            /** Industry */
            industry?: string | null;
            /** Logo Url */
            logo_url?: string | null;
        };
        /**
         * BridgeSessionDropped
         * @description DELETE /bridge/session (ruling 18 Nov 2026): a staff member dropped the
         *     shop's relayed Taylor session — for an uninstall, or a machine no longer
         *     trusted. ``had_session`` says whether there was one to remove; the bridge
         *     reads ``expired`` true until it signs in and relays again.
         */
        BridgeSessionDropped: {
            /**
             * Dropped At
             * Format: date-time
             */
            dropped_at: string;
            /** Had Session */
            had_session: boolean;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
        };
        /**
         * BridgeSessionState
         * @description GET /bridge/session (dispatch 16 Nov 2026, item 1 — the Python bridge's
         *     sign-in loop): whether the shop's saved Taylor session still works, as
         *     Teaky last saw it. ``relayed_at`` is the last relay the bridge made;
         *     ``expired_at`` the finish of the last pull that ended ``session_expired``;
         *     ``expired`` is true when that pull is newer than the last relay — the
         *     bridge's signal to sign in again, locally, and relay. No cookie, no value,
         *     no login from here.
         */
        BridgeSessionState: {
            /**
             * Expired
             * @default false
             */
            expired: boolean;
            /** Expired At */
            expired_at?: string | null;
            /** Last Pull Finished At */
            last_pull_finished_at?: string | null;
            /** Last Pull Status */
            last_pull_status?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Relayed At */
            relayed_at?: string | null;
        };
        /** BridgeTokenCreate */
        BridgeTokenCreate: {
            /** Label */
            label: string;
        };
        /**
         * BridgeTokenIssued
         * @description The one response that carries the token: it is not stored and cannot
         *     be shown again.
         */
        BridgeTokenIssued: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Label */
            label: string;
            /** Token */
            token: string;
        };
        /** BridgeTokenSummary */
        BridgeTokenSummary: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Label */
            label: string;
            /** Last Used At */
            last_used_at?: string | null;
            /** Revoked At */
            revoked_at?: string | null;
        };
        /**
         * BudgetTierPrices
         * @description Per-tier unit prices for a playbook product.
         *
         *     Fields use None defaults to distinguish absent-tier (fallback applies)
         *     from explicit-zero-value (no fallback). Consumers should use
         *     `or prices.standard` for fallback semantics.
         */
        BudgetTierPrices: {
            /** Economy */
            economy?: number | null;
            /** Premium */
            premium?: number | null;
            /** Standard */
            standard?: number | null;
        };
        /** BugReport */
        BugReport: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Notified */
            notified: boolean;
        };
        /** BugReportCreate */
        BugReportCreate: {
            /** Description */
            description: string;
            /** Page Url */
            page_url: string;
            /** Screenshot Url */
            screenshot_url?: string | null;
        };
        /** BundleEntry */
        BundleEntry: {
            /** Path */
            path: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
        };
        /**
         * BundleManifest
         * @description The zip's listing with provenance: every path, its size and hash;
         *     the counts R6 states (exactly capacity art-or-blank files).
         */
        BundleManifest: {
            /** Art Files */
            art_files: number;
            /** Batch Number */
            batch_number: number;
            /** Blank Files */
            blank_files: number;
            /** Built At */
            built_at?: string | null;
            /** Built By Id */
            built_by_id?: string | null;
            /** Capacity */
            capacity: number;
            /** Entries */
            entries?: components["schemas"]["BundleEntry"][];
            /** File Id */
            file_id?: string | null;
            /** Folder */
            folder: string;
            /** Po Files */
            po_files: number;
            /** Unit Id */
            unit_id?: string | null;
            /** Used */
            used: number;
            /**
             * Zip Sha256
             * @default
             */
            zip_sha256: string;
            /**
             * Zip Size Bytes
             * @default 0
             */
            zip_size_bytes: number;
        };
        /**
         * BundleWrittenReport
         * @description What the bridge says after a write: the zip's sha256 it verified, the
         *     files it wrote (each with its own sha256) — or ``ok`` false and why it
         *     wrote nothing.
         */
        BundleWrittenReport: {
            /**
             * File Count
             * @default 0
             */
            file_count: number;
            /** Files */
            files?: components["schemas"]["WrittenFile"][];
            /** Ok */
            ok: boolean;
            /** Reason */
            reason?: string | null;
            /** Sha256 */
            sha256: string;
        };
        /** BundleWrittenResult */
        BundleWrittenResult: {
            /**
             * File Id
             * Format: uuid
             */
            file_id: string;
            /** Status */
            status: string;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
            /** Write Failed At */
            write_failed_at?: string | null;
            /** Written At */
            written_at?: string | null;
        };
        /**
         * BusinessEntity
         * @description One entity of the shop's list. ``seeded`` marks the three the seed
         *     created; ``shipping_csv`` is the entity's own shipper block for the
         *     ALLORDER CSV (null = the shop's); ``docket_customer_id`` is the entity's
         *     own DocketManager customer id ('' = the shop's, ruling 14 Nov 2026).
         */
        BusinessEntity: {
            /**
             * Active
             * @default true
             */
            active: boolean;
            /** Code */
            code: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Docket Customer Id
             * @default
             */
            docket_customer_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Seeded
             * @default false
             */
            seeded: boolean;
            shipping_csv?: components["schemas"]["ShippingCsvConfig"] | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** BusinessEntityCreateRequest */
        BusinessEntityCreateRequest: {
            /** Code */
            code: string;
            /**
             * Docket Customer Id
             * @default
             */
            docket_customer_id: string;
            /** Name */
            name: string;
            shipping_csv?: components["schemas"]["ShippingCsvConfig"] | null;
        };
        /**
         * BusinessEntityOverrideRequest
         * @description A person's override of an order's or a release unit's entity: an
         *     entity of the caller's shop and why (audited).
         */
        BusinessEntityOverrideRequest: {
            /**
             * Business Entity Id
             * Format: uuid
             */
            business_entity_id: string;
            /** Reason */
            reason: string;
        };
        /** BusinessEntityOverrideResult */
        BusinessEntityOverrideResult: {
            business_entity: components["schemas"]["BusinessEntityRef"];
            previous?: components["schemas"]["BusinessEntityRef"] | null;
            /**
             * Resource Id
             * Format: uuid
             */
            resource_id: string;
            resource_type: components["schemas"]["BusinessEntityResourceType"];
        };
        /**
         * BusinessEntityRef
         * @description The entity as a read carries it: id, code and name.
         */
        BusinessEntityRef: {
            /** Code */
            code: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
        };
        /**
         * BusinessEntityResourceType
         * @description What a business-entity override names (dispatch 13 Nov 2026 evening,
         *     C): an order or a release unit. The audit row's ``resource_type``.
         * @enum {string}
         */
        BusinessEntityResourceType: "order" | "release_unit";
        /**
         * BusinessEntityRule
         * @description One assignment rule. ``channel`` '' is any channel; ``customer_match``
         *     '' is any customer, else a case-insensitive exact match on the order's
         *     customer name. The lowest ``priority`` that matches wins; the seed's
         *     catch-all is 1000.
         */
        BusinessEntityRule: {
            business_entity: components["schemas"]["BusinessEntityRef"];
            /**
             * Channel
             * @default
             */
            channel: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Created By Id */
            created_by_id?: string | null;
            /**
             * Customer Match
             * @default
             */
            customer_match: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Priority
             * @default 100
             */
            priority: number;
        };
        /**
         * BusinessEntityRuleCreateRequest
         * @description ``channel`` null is any channel; ``customer_match`` '' is any customer.
         */
        BusinessEntityRuleCreateRequest: {
            /**
             * Business Entity Id
             * Format: uuid
             */
            business_entity_id: string;
            channel?: components["schemas"]["OrderChannel"] | null;
            /**
             * Customer Match
             * @default
             */
            customer_match: string;
            /**
             * Priority
             * @default 100
             */
            priority: number;
        };
        /**
         * BusinessEntitySeedResult
         * @description What the seed did: the shop's list after it, how many entities and
         *     rules it created (0 on a shop already seeded), and how many existing
         *     orders and release units it assigned by rule.
         */
        BusinessEntitySeedResult: {
            /** Entities */
            entities?: components["schemas"]["BusinessEntity"][];
            /**
             * Entities Created
             * @default 0
             */
            entities_created: number;
            /**
             * Orders Assigned
             * @default 0
             */
            orders_assigned: number;
            /**
             * Release Units Assigned
             * @default 0
             */
            release_units_assigned: number;
            /**
             * Rules Created
             * @default 0
             */
            rules_created: number;
        };
        /**
         * BusinessEntityUpdateRequest
         * @description PATCH: only the fields sent change. ``shipping_csv`` sent as null
         *     clears the entity's shipper block (the shop's applies again);
         *     ``docket_customer_id`` sent as '' clears the entity's Docket customer
         *     (the shop's applies again).
         */
        BusinessEntityUpdateRequest: {
            /** Active */
            active?: boolean | null;
            /** Docket Customer Id */
            docket_customer_id?: string | null;
            /** Name */
            name?: string | null;
            shipping_csv?: components["schemas"]["ShippingCsvConfig"] | null;
        };
        /** CancelHeldUnitsRequest */
        CancelHeldUnitsRequest: {
            /** Reason */
            reason: string;
        };
        /** CancelOrderRequest */
        CancelOrderRequest: {
            /** Reason */
            reason: string;
            /**
             * Refund
             * @default false
             */
            refund: boolean;
        };
        /**
         * CanonicalLineState
         * @description One pool (ruling 9 Nov 2026, bead p8zr): where a channel's raw record
         *     stands against the canonical line it must become — ``pending`` until the
         *     normaliser has written the line item, ``written`` with its reference, or
         *     ``blocked`` with the reason a person must read.
         * @enum {string}
         */
        CanonicalLineState: "pending" | "written" | "blocked";
        /** Capability */
        Capability: {
            /** Category */
            category?: string | null;
            /** Description */
            description?: string | null;
            /** Icon Name */
            icon_name?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /** Sort Order */
            sort_order: number;
        };
        /** Cart */
        Cart: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Items */
            items?: components["schemas"]["CartItem"][];
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Status */
            status: string;
            /**
             * Subtotal
             * @default 0
             */
            subtotal: number;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** CartItem */
        CartItem: {
            /** Artwork Change Note */
            artwork_change_note?: string | null;
            artwork_disposition?: components["schemas"]["ArtworkDisposition"] | null;
            /** Artwork Upload Url */
            artwork_upload_url?: string | null;
            /**
             * Cart Id
             * Format: uuid
             */
            cart_id: string;
            /** Color */
            color?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Max Order Quantity */
            max_order_quantity?: number | null;
            /** Options */
            options?: {
                [key: string]: unknown;
            } | null;
            /**
             * Pack Size
             * @default 1
             */
            pack_size: number;
            /** Price Option */
            price_option?: string | null;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Quantity */
            quantity: number;
            /** Recipients */
            recipients?: components["schemas"]["Recipient"][];
            /** Size */
            size?: string | null;
            /** Unit Price */
            unit_price: number;
        };
        /** Category */
        Category: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Description */
            description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Parent Id */
            parent_id?: string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Slug */
            slug: string;
            /** Sort Order */
            sort_order: number;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * CategoryBudget
         * @description Named category budget allocation.
         */
        CategoryBudget: {
            /** Amount */
            amount: number;
            /** Category */
            category: string;
        };
        /**
         * CategoryMargin
         * @description Default margin for a product category, derived from the master catalog.
         */
        CategoryMargin: {
            /** Category */
            category: string;
            /** Default Margin Percent */
            default_margin_percent: string;
            /**
             * Sample Size
             * @description Seed products the median was taken over
             */
            sample_size: number;
        };
        /**
         * ChangePasswordRequest
         * @description POST /auth/change-password (t01): the current password is required;
         *     every other session of the user ends; the caller gets fresh tokens.
         */
        ChangePasswordRequest: {
            /** Current Password */
            current_password: string;
            /** New Password */
            new_password: string;
        };
        /**
         * ChannelConfig
         * @description A channel's own settings under the shop's press-run configuration.
         */
        ChannelConfig: {
            /** Channel */
            channel: string;
            docket_customer?: components["schemas"]["DocketCustomer"] | null;
            /**
             * Docket Service Url
             * @default
             */
            docket_service_url: string;
            /**
             * Pull Interval Minutes
             * @default 15
             */
            pull_interval_minutes: number;
        };
        /**
         * ChannelFact
         * @description One fact the channel stated, with where it came from and when.
         */
        ChannelFact: {
            key: components["schemas"]["ChannelFactKey"];
            /**
             * Recorded At
             * Format: date-time
             */
            recorded_at: string;
            /** Source */
            source: string;
            /** Value */
            value: string;
        };
        /**
         * ChannelFactKey
         * @description A fact a channel states about an order (13 Nov 2026), recorded on the
         *     order as the channel sent it: what the shipping step must honour.
         * @enum {string}
         */
        ChannelFactKey: "blind_ship" | "ups_third_party_account" | "po_on_packing_slip_and_label" | "carrier" | "vendor_po" | "ship_to_unparsed";
        /**
         * ChannelFollowUp
         * @description A task the channel asks for after a step; ``done`` is false until a
         *     person marks it (no automation).
         */
        ChannelFollowUp: {
            /**
             * Done
             * @default false
             */
            done: boolean;
            key: components["schemas"]["ChannelFollowUpKey"];
            /** Text */
            text: string;
        };
        /**
         * ChannelFollowUpKey
         * @description Something a person must do for a channel order after a step (13 Nov
         *     2026). Recorded, never automated.
         * @enum {string}
         */
        ChannelFollowUpKey: "submit_shipment_information";
        /**
         * ClearLockoutRequest
         * @description A person clears a lockout: by the account's email, by the source
         *     address, or both. At least one is required.
         */
        ClearLockoutRequest: {
            /** Email */
            email?: string | null;
            /** Source Address */
            source_address?: string | null;
        };
        /**
         * ClearLockoutResponse
         * @description What was cleared, as key names (the account is hashed in the key, so
         *     the response carries no email it was not given).
         */
        ClearLockoutResponse: {
            /** Cleared */
            cleared?: string[];
        };
        /** ClientAnalytics */
        ClientAnalytics: {
            /** Average Order Value */
            average_order_value: number;
            /** First Order Date */
            first_order_date: string | null;
            /** Last Order Date */
            last_order_date: string | null;
            /** Order Count */
            order_count: number;
            /** Portal Id */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
            /** Reorder Rate */
            reorder_rate: number | null;
            /** Top Products */
            top_products: components["schemas"]["TopProduct"][];
            /** Total Spend */
            total_spend: number;
        };
        /**
         * CloneCategoryRequest
         * @description Request to clone all products in a category into a portal.
         */
        CloneCategoryRequest: {
            /** Category */
            category: string;
            /** Markup Percent */
            markup_percent?: number | string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** @default use_suggested */
            pricing_strategy: components["schemas"]["PricingStrategy"];
        };
        /**
         * CloneResult
         * @description Result of a clone operation.
         */
        CloneResult: {
            /** Errors */
            errors?: string[];
            /** Product Ids */
            product_ids?: string[];
            /** Products Cloned */
            products_cloned: number;
            /**
             * Skipped
             * @default 0
             */
            skipped: number;
        };
        /**
         * CloneToPortalRequest
         * @description Request to clone a master catalog product into a portal.
         */
        CloneToPortalRequest: {
            /** Manual Price */
            manual_price?: number | string | null;
            /** Markup Percent */
            markup_percent?: number | string | null;
            /**
             * Master Product Id
             * Format: uuid
             */
            master_product_id: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** @default use_suggested */
            pricing_strategy: components["schemas"]["PricingStrategy"];
        };
        /** ColorOption */
        ColorOption: {
            /** Hex Code */
            hex_code?: string | null;
            /** Image Url */
            image_url?: string | null;
            /** Name */
            name: string;
        };
        /**
         * ColumnMappingRequest
         * @description User-provided mapping from their column names to Teaky field names.
         */
        ColumnMappingRequest: {
            /**
             * Column Mapping
             * @description Maps source column name -> Teaky field name
             */
            column_mapping: {
                [key: string]: string;
            };
            /**
             * Portal Id
             * @description Portal ID for product imports
             */
            portal_id?: string | null;
        };
        /** CompanyProfile */
        CompanyProfile: {
            /** Address Line1 */
            address_line1?: string | null;
            /** Address Line2 */
            address_line2?: string | null;
            brand_colors?: components["schemas"]["BrandColors"] | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Description */
            description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Industry */
            industry?: string | null;
            /** Is Wizard Complete */
            is_wizard_complete: boolean;
            /** Location City */
            location_city?: string | null;
            /** Location Country */
            location_country?: string | null;
            /** Location State */
            location_state?: string | null;
            /** Logo Url */
            logo_url?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Phone */
            phone?: string | null;
            /** Postal Code */
            postal_code?: string | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Website Url */
            website_url?: string | null;
        };
        /**
         * ConfigureFundraiserRequest
         * @description Request to configure a portal as a fundraiser.
         */
        ConfigureFundraiserRequest: {
            /**
             * Allow Donations
             * @default false
             */
            allow_donations: boolean;
            /** Cause Amount Per Item */
            cause_amount_per_item: number | string;
            /** Cause Description */
            cause_description: string;
            /** End Date */
            end_date?: string | null;
            /** Goal Amount */
            goal_amount: number | string;
            /** Organizer Name */
            organizer_name: string;
        };
        /** ConfirmCheckoutRequest */
        ConfirmCheckoutRequest: {
            /**
             * Cart Id
             * Format: uuid
             */
            cart_id: string;
            /** Needed By */
            needed_by?: string | null;
            /** Notes */
            notes?: string | null;
            /** Payment Intent Id */
            payment_intent_id: string;
            /**
             * Payment Method
             * @default stripe
             */
            payment_method: string;
            /** Po Number */
            po_number?: string | null;
            /** Proof Email */
            proof_email?: string | null;
            shipping_address: components["schemas"]["ShippingAddressInput"];
        };
        /**
         * ConfirmPriceRequest
         * @description RGI's decision to keep the published price (S87). ``option_label``
         *     names the option whose price is kept; omit it for the product's price.
         */
        ConfirmPriceRequest: {
            /** Option Label */
            option_label?: string | null;
        };
        /**
         * ConvertFileRequest
         * @description Route-level request for file conversion.
         */
        ConvertFileRequest: {
            /**
             * Maintain Aspect Ratio
             * @default true
             */
            maintain_aspect_ratio: boolean;
            /** Target Color Mode */
            target_color_mode?: string | null;
            /** Target Dpi */
            target_dpi?: number | null;
            /**
             * Target Format
             * @default TIFF
             */
            target_format: string;
            /** Target Height Px */
            target_height_px?: number | null;
            /** Target Width Px */
            target_width_px?: number | null;
        };
        /**
         * ConvertFileResponse
         * @description Route-level response from file conversion.
         */
        ConvertFileResponse: {
            /** Conversions Applied */
            conversions_applied?: string[];
            /**
             * File Size Bytes
             * @default 0
             */
            file_size_bytes: number;
            /** Issues */
            issues?: string[];
            /**
             * Output Base64
             * @default
             */
            output_base64: string;
            /**
             * Source Color Mode
             * @default
             */
            source_color_mode: string;
            /** Source Format */
            source_format?: string | null;
            /** Success */
            success: boolean;
            /**
             * Target Color Mode
             * @default
             */
            target_color_mode: string;
            /**
             * Target Dpi
             * @default 0
             */
            target_dpi: number;
            /**
             * Target Format
             * @default
             */
            target_format: string;
        };
        /**
         * CreateAgentTaskRequest
         * @description Request to create a new agent task.
         */
        CreateAgentTaskRequest: {
            /** Agent Type */
            agent_type: string;
            /** Channel */
            channel?: string | null;
            /** External Ref */
            external_ref?: string | null;
            /** Portal Id */
            portal_id?: string | null;
            state?: components["schemas"]["AgentTaskState"] | null;
        };
        /** CreateCategoryRequest */
        CreateCategoryRequest: {
            /** Description */
            description?: string | null;
            /** Name */
            name: string;
            /** Parent Id */
            parent_id?: string | null;
            /** Slug */
            slug: string;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
        };
        /** CreateCompanyProfileRequest */
        CreateCompanyProfileRequest: {
            /** Address Line1 */
            address_line1?: string | null;
            /** Address Line2 */
            address_line2?: string | null;
            brand_colors?: components["schemas"]["BrandColors"] | null;
            /** Description */
            description?: string | null;
            /** Industry */
            industry?: string | null;
            /** Location City */
            location_city?: string | null;
            /** Location Country */
            location_country?: string | null;
            /** Location State */
            location_state?: string | null;
            /** Logo Url */
            logo_url?: string | null;
            /** Phone */
            phone?: string | null;
            /** Postal Code */
            postal_code?: string | null;
            /** Website Url */
            website_url?: string | null;
        };
        /**
         * CreateEquipmentRequest
         * @description Request to create a custom equipment entry for an organization.
         */
        CreateEquipmentRequest: {
            /** Category */
            category?: string | null;
            equipment_type: components["schemas"]["EquipmentType"];
            /** Manufacturer */
            manufacturer?: string | null;
            /** Max Colors */
            max_colors?: number | null;
            /** Model Number */
            model_number?: string | null;
            /** Name */
            name: string;
            /** Print Area Height */
            print_area_height?: number | null;
            /** Print Area Width */
            print_area_width?: number | null;
            /** Specifications */
            specifications?: components["schemas"]["PressSpec"] | components["schemas"]["FinishingSpec"] | components["schemas"]["MailingSpec"] | components["schemas"]["WideFormatSpec"] | components["schemas"]["CuttingSpec"] | components["schemas"]["SpecialtyProductionSpec"] | components["schemas"]["BinderySpec"] | components["schemas"]["FlexographicSpec"] | components["schemas"]["PrePressSpec"] | components["schemas"]["LaminatorSpec"] | components["schemas"]["UVCoatingSpec"] | components["schemas"]["FoilStampingSpec"] | null;
        };
        /** CreateEscalationRequest */
        CreateEscalationRequest: {
            auto_context?: components["schemas"]["AutoContext-Input"] | null;
            issue_type: components["schemas"]["IssueType"];
            /** Message */
            message: string;
            /** Page Context */
            page_context?: string | null;
            /** To Role */
            to_role?: string | null;
            /** To User Id */
            to_user_id?: string | null;
        };
        /** CreateOrderFromCartRequest */
        CreateOrderFromCartRequest: {
            /**
             * Cart Id
             * Format: uuid
             */
            cart_id: string;
            /** Needed By */
            needed_by?: string | null;
            /** Notes */
            notes?: string | null;
            /**
             * Payment Method
             * @default stripe
             */
            payment_method: string;
            /** Po Number */
            po_number?: string | null;
            /** Proof Email */
            proof_email?: string | null;
            shipping_address: components["schemas"]["ShippingAddressInput"];
        };
        /** CreateOrderOnBehalfRequest */
        CreateOrderOnBehalfRequest: {
            /** @default standard */
            channel: components["schemas"]["OrderChannel"];
            /** Customer Email */
            customer_email?: string | null;
            /** Customer Id */
            customer_id?: string | null;
            /** Customer Name */
            customer_name?: string | null;
            for_whom?: components["schemas"]["OrderContact"] | null;
            /** Items */
            items: components["schemas"]["OnBehalfLineItemRequest"][];
            /** Needed By */
            needed_by?: string | null;
            /** Notes */
            notes?: string | null;
            ordering_contact?: components["schemas"]["OrderContact"] | null;
            /**
             * Payment Method
             * @default invoice_later
             */
            payment_method: string;
            /** Po Number */
            po_number?: string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Proof Email */
            proof_email?: string | null;
            /** Reordered From Order Id */
            reordered_from_order_id?: string | null;
            shipping_address: components["schemas"]["ShippingAddressInput"];
        };
        /** CreatePaymentIntentRequest */
        CreatePaymentIntentRequest: {
            /**
             * Cart Id
             * Format: uuid
             */
            cart_id: string;
        };
        /** CreatePaymentIntentResponse */
        CreatePaymentIntentResponse: {
            /** Amount */
            amount: number;
            /** Client Secret */
            client_secret: string;
            /** Payment Intent Id */
            payment_intent_id: string;
            /** Shipping Cost */
            shipping_cost: string;
            /** Subtotal */
            subtotal: string;
            /** Tax Amount */
            tax_amount: string;
        };
        /**
         * CreatePlaybookRequest
         * @description Request to create a new playbook template.
         */
        CreatePlaybookRequest: {
            budget_guidance?: components["schemas"]["PlaybookBudgetGuidance"] | null;
            /** Category */
            category: string;
            /** Default Scale */
            default_scale: number;
            /** Description */
            description: string;
            design_theme?: components["schemas"]["PlaybookDesignTheme"] | null;
            /** Name */
            name: string;
            /** Pro Tips */
            pro_tips?: string[];
            /** Products */
            products: components["schemas"]["PlaybookProductSpec"][];
            /** Scaling Variable */
            scaling_variable: string;
            /** Timeline */
            timeline?: components["schemas"]["PlaybookTimelineStep"][];
        };
        /** CreatePortalRequest */
        CreatePortalRequest: {
            brand_config?: components["schemas"]["BrandConfig"] | null;
            /**
             * Created Via
             * @default wizard
             */
            created_via: string;
            customer_classification?: components["schemas"]["CustomerClassification"] | null;
            /** Name */
            name: string;
            /** Revenue Share Rate */
            revenue_share_rate?: number | string | null;
            /** Slug */
            slug: string;
            /**
             * Type
             * @default standard
             */
            type: string;
        };
        /**
         * CreateProductRequest
         * @description A product as the printer creates it. Unknown keys are rejected (422), never dropped.
         */
        CreateProductRequest: {
            /** Base Cost */
            base_cost?: number | string | null;
            /** Base Price */
            base_price?: number | string | null;
            /** Category */
            category: string;
            /**
             * Collects Recipients
             * @default false
             */
            collects_recipients: boolean;
            /** Colors */
            colors?: components["schemas"]["ColorOption"][];
            /** Cost Source */
            cost_source?: string | null;
            /** Cost Source Url */
            cost_source_url?: string | null;
            /** Description */
            description?: string | null;
            /** Dm External Id */
            dm_external_id?: string | null;
            /** Floor Multiplier */
            floor_multiplier?: number | string | null;
            /** Margin Percent */
            margin_percent?: number | string | null;
            /** Markup Multiplier */
            markup_multiplier?: number | string | null;
            /** Max Order Quantity */
            max_order_quantity?: number | null;
            /**
             * Min Order Qty
             * @default 1
             */
            min_order_qty: number;
            /** Mockup Urls */
            mockup_urls?: string[];
            /** Name */
            name: string;
            /** Option Set Name */
            option_set_name?: string | null;
            /**
             * Pack Size
             * @default 1
             */
            pack_size: number;
            /** Price Locked */
            price_locked?: boolean | null;
            /** Price Options */
            price_options?: components["schemas"]["PriceOptionInput"][];
            /** Pricing Tiers */
            pricing_tiers?: components["schemas"]["PricingTier-Input"][];
            /**
             * Proof Required
             * @default false
             */
            proof_required: boolean;
            /**
             * Safe Order Eligible
             * @default false
             */
            safe_order_eligible: boolean;
            /** Sizes */
            sizes?: components["schemas"]["SizeOption-Input"][];
            /** Sku */
            sku?: string | null;
            /** Status */
            status?: string | null;
        };
        /** CreateQuoteRequest */
        CreateQuoteRequest: {
            /** Description */
            description: string;
            /** Desired Date */
            desired_date?: string | null;
            /** Notes */
            notes?: string | null;
            /** Product Id */
            product_id?: string | null;
            /** Quantity */
            quantity: number;
        };
        /** CreateVariantRequest */
        CreateVariantRequest: {
            /**
             * Auto Reorder Enabled
             * @default false
             */
            auto_reorder_enabled: boolean;
            /** Auto Reorder Quantity */
            auto_reorder_quantity?: number | null;
            /** Color */
            color?: string | null;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /**
             * Low Stock Threshold
             * @default 20
             */
            low_stock_threshold: number;
            /** Price Override */
            price_override?: number | string | null;
            /** Size */
            size?: string | null;
            /** Sku */
            sku?: string | null;
            /** Stock Quantity */
            stock_quantity?: number | null;
            /**
             * Track Inventory
             * @default false
             */
            track_inventory: boolean;
        };
        /** CreateWebhookRequest */
        CreateWebhookRequest: {
            /** Events */
            events: components["schemas"]["WebhookEvent"][];
            /** Secret */
            secret: string;
            /** Url */
            url: string;
        };
        /** CustomDomainResponse */
        CustomDomainResponse: {
            /** Custom Domain */
            custom_domain: string | null;
            /** Dns Verified */
            dns_verified: boolean;
            /**
             * Expected Cname
             * @default portals.teaky.com
             */
            expected_cname: string;
        };
        /**
         * CustomerClassification
         * @description Who brought the account (plan §5.3; set once on the portal, never edited
         *     in place — a later correction is a new ruling, not a PATCH).
         * @enum {string}
         */
        CustomerClassification: "existing" | "teaky_sold" | "rgi_sold";
        /**
         * CustomerTagRule
         * @description Ruling 18 Nov 2026 (Andrew, 17 Nov): a customer → tags map the intake
         *     applies to every order of that customer on every channel — Sprouts →
         *     ["Express"]. Shop configuration, seeded through the press-run-config
         *     route, never a hardcode. ``channel`` '' means any channel. Matching as the
         *     business-entity rules: the customer name case-insensitive, exact,
         *     trimmed. Staff can still set tags by hand (PATCH /orders/{id}); the rule
         *     only adds.
         */
        CustomerTagRule: {
            /**
             * Channel
             * @default
             */
            channel: string;
            /** Customer Match */
            customer_match: string;
            /** Tags */
            tags: string[];
        };
        /**
         * CuttingSpec
         * @description Digital cutters and CNC-adjacent finishing — flatbed cutting,
         *     die cutting, CNC routers.
         *
         *     Covers enums ``cutting_finishing``, ``die_cutting``, ``cnc_router``.
         *     Seed data has two populated records under ``cutting_finishing``
         *     (Zünd D3-L3200, Kongsberg C64/66); ``die_cutting`` and
         *     ``cnc_router`` have no populated records today but share the
         *     same schema.
         *
         *     Cutting-area axes: ``cutting_area_width_mm`` is the table x-axis
         *     (the narrower dimension on standard flatbeds), ``cutting_area_length_mm``
         *     is the y-axis (the longer dimension). Seed strings like
         *     "70.9 x 126" and "1800 x 3200" follow width-first convention.
         *
         *     ``positional_accuracy_microns`` and ``repeatability_microns`` extend
         *     the H-3 microns convention to cover both sub-millimeter precision
         *     measurements; see bead decision 1, H-3 EXTENSION note.
         *
         *     ``positional_accuracy_microns`` is shared with ``WideFormatSpec``.
         */
        CuttingSpec: {
            /** Acceleration G */
            acceleration_g?: number | null;
            /** Cutting Area Common Name */
            cutting_area_common_name?: string | null;
            /** Cutting Area Length Mm */
            cutting_area_length_mm?: number | null;
            /** Cutting Area Width Mm */
            cutting_area_width_mm?: number | null;
            /** Dual Beam */
            dual_beam?: boolean | null;
            /** Limitations */
            limitations?: string[];
            /** Max Material Thickness Extended Mm */
            max_material_thickness_extended_mm?: number | null;
            /** Max Material Thickness Mm */
            max_material_thickness_mm?: number | null;
            /** Max Simultaneous Tools */
            max_simultaneous_tools?: number | null;
            /** Mechanical Speed Mm Per Second */
            mechanical_speed_mm_per_second?: number | null;
            /** Notes */
            notes?: string | null;
            /** Positional Accuracy Microns */
            positional_accuracy_microns?: number | null;
            /** Repeatability Microns */
            repeatability_microns?: number | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Speed Mm Per Second */
            speed_mm_per_second?: number | null;
            /** Supported Materials */
            supported_materials?: string[];
            /** Tools */
            tools?: string[];
            /** Typical Products */
            typical_products: string[];
            /** Vacuum Zones */
            vacuum_zones?: number | null;
            /** Working Speed Mm Per Second */
            working_speed_mm_per_second?: number | null;
        };
        /** DecideActionRequest */
        DecideActionRequest: {
            /**
             * Note
             * @default
             */
            note: string;
        };
        /** DecideAdminActionRequest */
        DecideAdminActionRequest: {
            /**
             * Note
             * @default
             */
            note: string;
        };
        /**
         * DecorationAreaInfo
         * @description A decoration area within a product template.
         */
        DecorationAreaInfo: {
            /** Description */
            description: string;
            /** Height */
            height: number;
            /** Max Colors */
            max_colors?: number | null;
            /** Name */
            name: string;
            /** Width */
            width: number;
            /** X */
            x: number;
            /** Y */
            y: number;
        };
        /**
         * DesignExportRequest
         * @description Request to export a design session as an editable file.
         */
        DesignExportRequest: {
            /** Bleed In */
            bleed_in?: number | null;
            /** @default svg */
            format: components["schemas"]["teaky_print_portal__models__schemas__design__ExportFormat"];
            /** Height In */
            height_in?: number | null;
            /** Width In */
            width_in?: number | null;
        };
        /**
         * DesignExportResponse
         * @description Response containing the exported design file.
         */
        DesignExportResponse: {
            /** Download Url */
            download_url?: string | null;
            /**
             * File Size Bytes
             * @default 0
             */
            file_size_bytes: number;
            format: components["schemas"]["ExportFormat-Output"];
            /**
             * Output Base64
             * @default
             */
            output_base64: string;
            /** Success */
            success: boolean;
        };
        /**
         * DesignGenerateRequest
         * @description Request to generate a new design from a description.
         */
        DesignGenerateRequest: {
            /** Background Color */
            background_color?: string | null;
            /** Decoration Area */
            decoration_area?: string | null;
            /** Description */
            description: string;
            /** Logo Base64 */
            logo_base64?: string | null;
            /** Portal Id */
            portal_id?: string | null;
            /** Product Type */
            product_type?: string | null;
        };
        /**
         * DesignGenerateResponse
         * @description Response from design generation or iteration.
         */
        DesignGenerateResponse: {
            /**
             * Confidence
             * @default 0.9
             */
            confidence: number;
            /** Decoration Area */
            decoration_area?: string | null;
            design_spec: components["schemas"]["DesignSpec"];
            /** Iteration Count */
            iteration_count: number;
            /** Mockup Base64 */
            mockup_base64?: string | null;
            /** Mockup Url */
            mockup_url?: string | null;
            /** Product Type */
            product_type?: string | null;
            /** Session Id */
            session_id: string;
        };
        /**
         * DesignHandoffRequest
         * @description Request to hand off a design session to the human design team.
         */
        DesignHandoffRequest: {
            /**
             * Notes
             * @default
             */
            notes: string;
            /**
             * Priority
             * @default normal
             */
            priority: string;
        };
        /**
         * DesignHandoffResponse
         * @description Response from design handoff.
         */
        DesignHandoffResponse: {
            /** Escalation Id */
            escalation_id?: string | null;
            handoff_package?: components["schemas"]["HandoffPackage-Output"] | null;
            /**
             * Message
             * @default
             */
            message: string;
            /** Session Id */
            session_id: string;
        };
        /**
         * DesignIterateRequest
         * @description Request to iterate on an existing design.
         */
        DesignIterateRequest: {
            /** Instruction */
            instruction: string;
        };
        /**
         * DesignSession
         * @description A design iteration session with conversation memory.
         */
        DesignSession: {
            /** Brand Assets Used */
            brand_assets_used?: string[];
            /** Created At */
            created_at?: string | null;
            /** Current Mockup Url */
            current_mockup_url?: string | null;
            current_spec?: components["schemas"]["DesignSpec"] | null;
            /**
             * Iteration Count
             * @default 0
             */
            iteration_count: number;
            /** Messages */
            messages?: components["schemas"]["DesignSessionMessage-Output"][];
            /** Org Id */
            org_id?: string | null;
            /** Portal Id */
            portal_id?: string | null;
            /** Product Type */
            product_type?: string | null;
            /** Session Id */
            session_id?: string;
            /** Updated At */
            updated_at?: string | null;
            /** User Id */
            user_id?: string | null;
        };
        /**
         * DesignSessionMessage
         * @description A single message in a design session conversation.
         */
        "DesignSessionMessage-Input": {
            /** Content */
            content: string;
            design_spec?: components["schemas"]["DesignSpec"] | null;
            /** Mockup Url */
            mockup_url?: string | null;
            /** Role */
            role: string;
            /**
             * Timestamp
             * Format: date-time
             */
            timestamp: string;
        };
        /**
         * DesignSessionMessage
         * @description A single message in a design session conversation.
         */
        "DesignSessionMessage-Output": {
            /** Content */
            content: string;
            design_spec?: components["schemas"]["DesignSpec"] | null;
            /** Mockup Url */
            mockup_url?: string | null;
            /** Role */
            role: string;
            /**
             * Timestamp
             * Format: date-time
             */
            timestamp: string;
        };
        /**
         * DesignSpec
         * @description AI-generated design specification from a natural language description.
         */
        DesignSpec: {
            /**
             * Background Color
             * @default white
             */
            background_color: string;
            /** Color Scheme */
            color_scheme?: {
                [key: string]: string;
            };
            /** Decoration Areas */
            decoration_areas?: string[];
            /**
             * Layout
             * @default centered
             */
            layout: string;
            logo_placement?: components["schemas"]["LogoPlacement"];
            /** Product Type */
            product_type?: string | null;
            /** Text Elements */
            text_elements?: components["schemas"]["TextElement"][];
        };
        /**
         * DMConfigSchema
         * @description Structured schema for org.mis_config when provider is docketmanager.
         *
         *     DocketManager's published order-import contract (ImportOrderRequest,
         *     docketmanager.freshdesk.com article 4000134110) carries the customer
         *     inline on every order, so the customer record Teaky is known as at the
         *     printer lives here rather than being created through an API.
         *
         *     ``api_key`` is the AuthenticationKey from the printer's DocketManager
         *     Integrations page.
         */
        "DMConfigSchema-Input": {
            /** Account Url */
            account_url: string;
            /** Api Key */
            api_key?: string | null;
            /**
             * Auto Push On Approval
             * @default true
             */
            auto_push_on_approval: boolean;
            /** Billing Address */
            billing_address?: string | null;
            /** Billing City */
            billing_city?: string | null;
            /**
             * Billing Country
             * @default USA
             */
            billing_country: string;
            /** Billing Postal Code */
            billing_postal_code?: string | null;
            /** Billing State */
            billing_state?: string | null;
            /** Contact Email */
            contact_email?: string | null;
            /** Contact Name */
            contact_name?: string | null;
            /** Customer Email */
            customer_email?: string | null;
            /** Customer Id */
            customer_id?: string | null;
            /** Customer Name */
            customer_name?: string | null;
            /** Customer Phone */
            customer_phone?: string | null;
            /** Order Desk Email */
            order_desk_email?: string | null;
            /** Order Desk Emails */
            order_desk_emails?: string[];
            /** Queue Mapping */
            queue_mapping?: components["schemas"]["QueueMappingEntry"][];
            /**
             * Service Name
             * @default Teaky
             */
            service_name: string;
            /**
             * Service Url
             * @default https://teakygrove.com
             */
            service_url: string;
            /**
             * Shipping Method
             * @default Ground
             */
            shipping_method: string;
            /** Webhook Secret */
            webhook_secret?: string | null;
        };
        /**
         * DMConfigSchema
         * @description Structured schema for org.mis_config when provider is docketmanager.
         *
         *     DocketManager's published order-import contract (ImportOrderRequest,
         *     docketmanager.freshdesk.com article 4000134110) carries the customer
         *     inline on every order, so the customer record Teaky is known as at the
         *     printer lives here rather than being created through an API.
         *
         *     ``api_key`` is the AuthenticationKey from the printer's DocketManager
         *     Integrations page.
         */
        "DMConfigSchema-Output": {
            /** Account Url */
            account_url: string;
            /** Api Key */
            api_key?: string | null;
            /**
             * Auto Push On Approval
             * @default true
             */
            auto_push_on_approval: boolean;
            /** Billing Address */
            billing_address?: string | null;
            /** Billing City */
            billing_city?: string | null;
            /**
             * Billing Country
             * @default USA
             */
            billing_country: string;
            /** Billing Postal Code */
            billing_postal_code?: string | null;
            /** Billing State */
            billing_state?: string | null;
            /** Contact Email */
            contact_email?: string | null;
            /** Contact Name */
            contact_name?: string | null;
            /** Customer Email */
            customer_email?: string | null;
            /** Customer Id */
            customer_id?: string | null;
            /** Customer Name */
            customer_name?: string | null;
            /** Customer Phone */
            customer_phone?: string | null;
            /** Order Desk Email */
            order_desk_email?: string | null;
            /** Order Desk Emails */
            order_desk_emails?: string[];
            /** Queue Mapping */
            queue_mapping?: {
                [key: string]: string;
            };
            /**
             * Service Name
             * @default Teaky
             */
            service_name: string;
            /**
             * Service Url
             * @default https://teakygrove.com
             */
            service_url: string;
            /**
             * Shipping Method
             * @default Ground
             */
            shipping_method: string;
            /** Webhook Secret */
            webhook_secret?: string | null;
        };
        /**
         * DocketCustomer
         * @description Who a Docket import is for (Docket.cs:107-113): the channel's Docket
         *     customer — for Taylor, Andrew's settings.json DocketCustomerId /
         *     DocketCustomerName / DocketContact* (Settings.cs:33-37). Never the shop.
         */
        DocketCustomer: {
            /**
             * Contact Email
             * @default
             */
            contact_email: string;
            /**
             * Contact Name
             * @default
             */
            contact_name: string;
            /**
             * Contact Phone
             * @default
             */
            contact_phone: string;
            /** Customer Id */
            customer_id: string;
            /** Name */
            name: string;
        };
        /**
         * DocketPayload
         * @description Part E: Andrew's ImportOrderRequest for one pushed batch, field for
         *     field (TaylorProcureInterface Docket.cs:86-131, Settings.cs:29-43), built
         *     from the unit's lines — never from the sheet (improvement 15). ``cards``
         *     is carried for the sheet comparison; his XML does not send it. ``quantity``
         *     is 250 as his tool sends it (recorded as a question for Andrew).
         */
        DocketPayload: {
            /**
             * Business Entity
             * @default
             */
            business_entity: string;
            /**
             * Cards
             * @default 0
             */
            cards: number;
            /** Contact Email */
            contact_email: string;
            /** Contact Name */
            contact_name: string;
            /** Contact Phone */
            contact_phone: string;
            /** Customer Id */
            customer_id: string;
            /** Customer Name */
            customer_name: string;
            /** Description */
            description: string;
            /** Item Code */
            item_code: string;
            /** Item Name */
            item_name: string;
            /** Item Total */
            item_total: string;
            /** Order Date */
            order_date?: string | null;
            /** Order Id */
            order_id: string;
            /** Order Name */
            order_name: string;
            /** Pos */
            pos?: string[];
            /**
             * Quantity
             * @default 250
             */
            quantity: number;
            /**
             * Service Name
             * @default Taylor Interface
             */
            service_name: string;
            /** Service Transaction Id */
            service_transaction_id: string;
            /** Service Url */
            service_url: string;
        };
        /** DocumentUploadResponse */
        DocumentUploadResponse: {
            /** File Url */
            file_url: string;
            /** Message */
            message: string;
            /**
             * Task Id
             * Format: uuid
             */
            task_id: string;
        };
        /**
         * DraftActionResponse
         * @description Response from approving or rejecting a draft.
         */
        DraftActionResponse: {
            /** Message */
            message: string;
            status: components["schemas"]["AgentTaskStatus"];
            /**
             * Task Id
             * Format: uuid
             */
            task_id: string;
        };
        /**
         * DuplicatePortalBatchRequest
         * @description Request to duplicate a portal for multiple locations.
         */
        DuplicatePortalBatchRequest: {
            /** Locations */
            locations: components["schemas"]["LocationRequest"][];
        };
        /**
         * DuplicatePortalBatchResponse
         * @description Response from batch portal duplication.
         */
        DuplicatePortalBatchResponse: {
            /** Portals */
            portals: components["schemas"]["Portal"][];
            /** Total Created */
            total_created: number;
        };
        /**
         * DuplicatePortalRequest
         * @description Request to duplicate a portal for a single location.
         */
        DuplicatePortalRequest: {
            /**
             * Custom Subdomain
             * @description Optional custom subdomain. Auto-generated from location_name if not provided.
             */
            custom_subdomain?: string | null;
            /**
             * Location Address
             * @description Optional location address
             */
            location_address?: string | null;
            /**
             * Location Name
             * @description Location name (required)
             */
            location_name: string;
        };
        /**
         * EasyPostAddress
         * @description EasyPost Address API pass-through schema (all fields optional per API).
         */
        EasyPostAddress: {
            /** City */
            city?: string | null;
            /** Company */
            company?: string | null;
            /** Country */
            country?: string | null;
            /** Email */
            email?: string | null;
            /** Name */
            name?: string | null;
            /** Phone */
            phone?: string | null;
            /** State */
            state?: string | null;
            /** Street1 */
            street1?: string | null;
            /** Street2 */
            street2?: string | null;
            /** Zip */
            zip?: string | null;
        };
        /**
         * EasyPostParcel
         * @description EasyPost Parcel API pass-through schema.
         *
         *     `weight` is the only API-required field (always required, in oz).
         *     Dimensions trio (length/width/height) and `predefined_package` are
         *     individually optional; EasyPost requires either the trio OR a
         *     predefined_package, but cross-field validation is deferred to the
         *     SDK (v1 scope per Anchor 2).
         */
        EasyPostParcel: {
            /** Height */
            height?: number | null;
            /** Length */
            length?: number | null;
            /** Predefined Package */
            predefined_package?: string | null;
            /** Weight */
            weight: number;
            /** Width */
            width?: number | null;
        };
        /**
         * EmailMark
         * @description An absolute image URL, its alt text (the shop's name, or "Teaky"), and
         *     where it was resolved from.
         */
        EmailMark: {
            /** Alt */
            alt: string;
            source: components["schemas"]["EmailMarkSource"];
            /** Url */
            url: string;
        };
        /**
         * EmailMarkSource
         * @description Where the mark heading a shop's email came from (ruling 17 Nov 2026):
         *     the inviting shop's company profile, its portal's brand configuration, or
         *     Teaky's own when the shop has none — never a constant for every shop.
         * @enum {string}
         */
        EmailMarkSource: "shop_profile" | "portal_brand" | "teaky";
        /**
         * EmergencyStopResponse
         * @description Response after activating/releasing emergency stop.
         */
        EmergencyStopResponse: {
            /** Activated At */
            activated_at: string | null;
            /** Activated By Id */
            activated_by_id: string | null;
            /** Emergency Stop Active */
            emergency_stop_active: boolean;
            /** Message */
            message: string;
        };
        /** Equipment */
        Equipment: {
            /** Category */
            category?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            equipment_type: components["schemas"]["EquipmentType"];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Custom */
            is_custom: boolean;
            /** Manufacturer */
            manufacturer?: string | null;
            /** Max Colors */
            max_colors?: number | null;
            /** Model Number */
            model_number?: string | null;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id?: string | null;
            /** Print Area Height */
            print_area_height?: number | null;
            /** Print Area Width */
            print_area_width?: number | null;
            /** Specifications */
            specifications?: components["schemas"]["PressSpec"] | components["schemas"]["FinishingSpec"] | components["schemas"]["MailingSpec"] | components["schemas"]["WideFormatSpec"] | components["schemas"]["CuttingSpec"] | components["schemas"]["SpecialtyProductionSpec"] | components["schemas"]["BinderySpec"] | components["schemas"]["FlexographicSpec"] | components["schemas"]["PrePressSpec"] | components["schemas"]["LaminatorSpec"] | components["schemas"]["UVCoatingSpec"] | components["schemas"]["FoilStampingSpec"] | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * EquipmentType
         * @description Types of printing equipment a shop may own.
         * @enum {string}
         */
        EquipmentType: "dtg" | "dtf" | "screen_print" | "embroidery" | "wide_format" | "heat_press" | "pad_print" | "sublimation" | "vinyl_cut" | "digital_press" | "offset" | "web_offset" | "cutting_finishing" | "laser_engraver" | "finishing" | "inserting" | "inkjet_addressing" | "mailing" | "bindery" | "laminator" | "die_cutting" | "flexographic" | "envelope_press" | "uv_coating" | "foil_stamping" | "prepress" | "cnc_router";
        /**
         * EscalateAgentTaskRequest
         * @description Request to escalate an agent task to a human.
         */
        EscalateAgentTaskRequest: {
            /** Assign To */
            assign_to?: string | null;
            /** Reason */
            reason: string;
        };
        /**
         * Escalation
         * @description Full escalation record.
         */
        Escalation: {
            auto_context?: components["schemas"]["AutoContext-Output"] | null;
            /** Created At */
            created_at: string;
            /** From User Email */
            from_user_email?: string | null;
            /** From User Id */
            from_user_id: string;
            /** Id */
            id: string;
            /** Issue Type */
            issue_type: string;
            /** Message */
            message: string;
            /** Organization Id */
            organization_id: string;
            /** Page Context */
            page_context?: string | null;
            /** Responded At */
            responded_at?: string | null;
            /** Responded By */
            responded_by?: string | null;
            /** Response Message */
            response_message?: string | null;
            /** Status */
            status: string;
            /** To Role */
            to_role?: string | null;
            /** To User Email */
            to_user_email?: string | null;
            /** To User Id */
            to_user_id?: string | null;
            /** Updated At */
            updated_at?: string | null;
        };
        /**
         * EscalationOption
         * @description A possible routing target for an escalation.
         */
        EscalationOption: {
            action_type: components["schemas"]["ActionType"];
            /** Context To Include */
            context_to_include?: string[];
            /** Description */
            description: string;
            /** Label */
            label: string;
            /** Route To Role */
            route_to_role: string;
            /** Route To User Id */
            route_to_user_id?: string | null;
        };
        /**
         * EscalationStatus
         * @enum {string}
         */
        EscalationStatus: "pending" | "in_progress" | "resolved" | "dismissed";
        /**
         * EscalationSuggestion
         * @description Returned alongside help search results when no good article match.
         */
        EscalationSuggestion: {
            /** Description */
            description: string;
            /** Issue Type */
            issue_type: string;
            /** Label */
            label: string;
            /** Route To Role */
            route_to_role: string;
            /**
             * Type
             * @default escalation_suggestion
             */
            type: string;
        };
        /**
         * ExportActivityFormat
         * @enum {string}
         */
        ExportActivityFormat: "clipboard" | "csv" | "xlsx";
        /** ExportActivityRequest */
        ExportActivityRequest: {
            format: components["schemas"]["ExportActivityFormat"];
        };
        /**
         * ExportFormat
         * @description Supported design export formats.
         * @enum {string}
         */
        "ExportFormat-Output": "svg" | "pdf";
        /**
         * ExportGrain
         * @description The production CSV's row unit (dispatch 17–18 Nov 2026, item 3;
         *     design search-export §2): one row per order placed in the window, per
         *     unit created in it, or per order line (D6, the default).
         * @enum {string}
         */
        ExportGrain: "orders" | "units" | "lines";
        /**
         * ExportType
         * @enum {string}
         */
        ExportType: "client" | "team" | "platform";
        /**
         * ExternalReference
         * @description One (system, kind, value) a unit carries (H v3 §2.6). ``system`` and
         *     ``kind`` are strings so an identifier from a newer adapter reads back
         *     whole; ``source`` says how it came to be known, and a ``person`` row is
         *     an assertion by ``asserted_by_id`` at ``asserted_at``.
         */
        ExternalReference: {
            /**
             * Asserted At
             * Format: date-time
             */
            asserted_at: string;
            /** Asserted By Id */
            asserted_by_id?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Is Identity
             * @default false
             */
            is_identity: boolean;
            /** Kind */
            kind: string;
            /** Source */
            source: string;
            /** System */
            system: string;
            /** Value */
            value: string;
        };
        /**
         * FeedbackSummary
         * @description Aggregated feedback summary for an organization.
         */
        FeedbackSummary: {
            /** By Agent */
            by_agent: components["schemas"]["AgentFeedbackStat"][];
            /** Explicit Count */
            explicit_count: number;
            /** Implicit Count */
            implicit_count: number;
            /** Thumbs Up Rate */
            thumbs_up_rate: number;
            /** Total Signals */
            total_signals: number;
        };
        /**
         * FillCandidateSummary
         * @description A waiting line that would fit the unit's blanks (the engine's advice).
         */
        FillCandidateSummary: {
            /** Age Seconds */
            age_seconds: number;
            /** Channel */
            channel: string;
            /** Line Item Ids */
            line_item_ids?: string[];
            /** Order Ref */
            order_ref: string;
            /** Slots */
            slots: number;
            /** Stock */
            stock: string;
        };
        /**
         * FinishingSpec
         * @description Finishing machines — folders, collators, tip-on, combo workflow.
         *
         *     Workflow-role category: the machine enables downstream products
         *     (folded brochures, collated sets, tipped-on response cards) rather
         *     than producing products on its own. See ``BaseEquipmentSpec``
         *     docstring for ``typical_products`` semantics on workflow-role
         *     machines.
         *
         *     Sheet and web dimension fields follow the H-3 metric-canonical
         *     pattern. ``feed_type`` and ``fold_type`` are free-form strings
         *     today — seed data encodes compound values like
         *     "combination knife/buckle" and "friction or pile (model-dependent)"
         *     that do not cleanly enumerate. May become StrEnum in a future bead
         *     if data converges on a canonical set.
         *
         *     ``pockets`` also appears on ``MailingSpec`` (for inserters); here
         *     it handles pocket collators like the Tower Collator 10-Pocket.
         */
        FinishingSpec: {
            /** Adhesive Type */
            adhesive_type?: string | null;
            /** Buckle Plates */
            buckle_plates?: number | null;
            /** Feed Type */
            feed_type?: string | null;
            /** Fold Patterns */
            fold_patterns?: string[];
            /** Fold Type */
            fold_type?: string | null;
            /** Glue Types */
            glue_types?: string[];
            /** Inline Gluer */
            inline_gluer?: boolean | null;
            /** Limitations */
            limitations?: string[];
            /** Max Sheet Length Common Name */
            max_sheet_length_common_name?: string | null;
            /** Max Sheet Length Mm */
            max_sheet_length_mm?: number | null;
            /** Max Sheet Width Common Name */
            max_sheet_width_common_name?: string | null;
            /** Max Sheet Width Mm */
            max_sheet_width_mm?: number | null;
            /** Max Web Width Common Name */
            max_web_width_common_name?: string | null;
            /** Max Web Width Mm */
            max_web_width_mm?: number | null;
            /** Notes */
            notes?: string | null;
            /** Pockets */
            pockets?: number | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Speed Notes */
            speed_notes?: string | null;
            /** Speed Pieces Per Hour */
            speed_pieces_per_hour?: number | null;
            /** Speed Sheets Per Hour */
            speed_sheets_per_hour?: number | null;
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /**
         * FlexographicSpec
         * @description Stub — enum ``flexographic``. No populated records in seed
         *     data today. Inherits only the universal base fields. Expand when
         *     enrichment populates real spec data.
         */
        FlexographicSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /**
         * FloorMark
         * @description The cost and price a floor event refers to, and when it happened.
         */
        FloorMark: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /** Cost */
            cost: number;
            /** Price */
            price: number;
        };
        /**
         * FloorState
         * @description Margin-floor bookkeeping (S87). ``alerted``: the price sat below the
         *     floor at this cost and price and RGI was told. ``kept``: RGI decided to
         *     keep the price at this cost and price, so no alert repeats until either
         *     moves.
         */
        FloorState: {
            alerted?: components["schemas"]["FloorMark"] | null;
            kept?: components["schemas"]["FloorMark"] | null;
        };
        /**
         * FoilStampingSpec
         * @description Stub — enum ``foil_stamping``. No populated records in seed
         *     data today. Inherits only the universal base fields. Expand
         *     when enrichment populates real spec data.
         */
        FoilStampingSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /** FulfillmentMetrics */
        FulfillmentMetrics: {
            /** Avg Approved To Shipped Hours */
            avg_approved_to_shipped_hours: number | null;
            /** Avg Placed To Approved Hours */
            avg_placed_to_approved_hours: number | null;
            /** Avg Placed To Delivered Hours */
            avg_placed_to_delivered_hours: number | null;
            /** Avg Shipped To Delivered Hours */
            avg_shipped_to_delivered_hours: number | null;
            /** Orders Measured */
            orders_measured: number;
        };
        /**
         * FundraiserDetails
         * @description Full fundraiser configuration and current status.
         */
        FundraiserDetails: {
            /** Allow Donations */
            allow_donations: boolean;
            /** Cause Amount Per Item */
            cause_amount_per_item: number;
            /** Cause Description */
            cause_description: string;
            /** Days Remaining */
            days_remaining?: number | null;
            /** End Date */
            end_date?: string | null;
            /** Goal Amount */
            goal_amount: number;
            /** Is Active */
            is_active: boolean;
            /** Organizer Name */
            organizer_name: string;
            /** Percentage Complete */
            percentage_complete: number;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
            /** Raised Amount */
            raised_amount: number;
        };
        /**
         * FundraiserReport
         * @description Final fundraiser report for the organizer.
         */
        FundraiserReport: {
            /** Cause Description */
            cause_description: string;
            /** Ended At */
            ended_at?: string | null;
            /** Goal Amount */
            goal_amount: number;
            /** Organizer Name */
            organizer_name: string;
            /** Percentage Complete */
            percentage_complete: number;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
            /** Raised Amount */
            raised_amount: number;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Timeline */
            timeline?: components["schemas"]["FundraiserTimelineEntry"][];
            /** Top Supporters */
            top_supporters?: components["schemas"]["FundraiserSupporter"][];
            /** Total Donations */
            total_donations: number;
            /** Total Orders */
            total_orders: number;
            /** Total Product Contributions */
            total_product_contributions: number;
            /** Total Supporters */
            total_supporters: number;
        };
        /**
         * FundraiserStats
         * @description Fundraiser statistics for analytics.
         */
        FundraiserStats: {
            /**
             * Average Contribution
             * @default 0
             */
            average_contribution: number;
            /** Days Remaining */
            days_remaining?: number | null;
            /** Goal Amount */
            goal_amount: number;
            /** Orders Count */
            orders_count: number;
            /** Percentage Complete */
            percentage_complete: number;
            /** Raised Amount */
            raised_amount: number;
            /** Supporters Count */
            supporters_count: number;
            /** Top Supporters */
            top_supporters?: components["schemas"]["FundraiserSupporter"][];
        };
        /**
         * FundraiserSupporter
         * @description A fundraiser supporter record (organiser-facing; carries record and order ids).
         */
        FundraiserSupporter: {
            /** Amount */
            amount: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Is Anonymous
             * @default false
             */
            is_anonymous: boolean;
            /**
             * Is Donation
             * @default false
             */
            is_donation: boolean;
            /** Order Id */
            order_id?: string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Supporter Name */
            supporter_name: string;
        };
        /**
         * FundraiserTimelineEntry
         * @description Daily aggregate for the fundraiser timeline.
         */
        FundraiserTimelineEntry: {
            /** Cumulative Raised */
            cumulative_raised: number;
            /** Date */
            date: string;
            /** Orders */
            orders: number;
            /** Raised */
            raised: number;
        };
        /**
         * GeneratePlaybookRequest
         * @description Request to generate a playbook from a natural language description.
         */
        GeneratePlaybookRequest: {
            /** Description */
            description: string;
        };
        /**
         * GenericCSVConfigSchema
         * @description Config for generic CSV/email export.
         */
        GenericCSVConfigSchema: {
            /**
             * Csv Format
             * @default standard
             */
            csv_format: string;
            /** Notification Email */
            notification_email: string;
        };
        /**
         * GenericWebhookConfigSchema
         * @description Config for generic webhook integration.
         */
        GenericWebhookConfigSchema: {
            /** Webhook Secret */
            webhook_secret?: string | null;
            /** Webhook Url */
            webhook_url: string;
        };
        /**
         * HandoffPackage
         * @description Design handoff payload assembled from a DesignSession.
         *
         *     Always-set keys come from the session + handoff request; conditionally-set
         *     keys (design_spec, editable_file_svg, editable_file_size_bytes) populate
         *     only when session.current_spec is present and SVG export succeeds.
         */
        "HandoffPackage-Input": {
            /** Brand Assets Used */
            brand_assets_used?: string[];
            /** Conversation History */
            conversation_history?: components["schemas"]["DesignSessionMessage-Input"][];
            /** Current Mockup Url */
            current_mockup_url?: string | null;
            design_spec?: components["schemas"]["DesignSpec"] | null;
            /** Editable File Size Bytes */
            editable_file_size_bytes?: number | null;
            /** Editable File Svg */
            editable_file_svg?: string | null;
            /**
             * Iteration Count
             * @default 0
             */
            iteration_count: number;
            /**
             * Priority
             * @default normal
             */
            priority: string;
            /** Product Type */
            product_type?: string | null;
            /** Session Id */
            session_id: string;
            /**
             * User Notes
             * @default
             */
            user_notes: string;
        };
        /**
         * HandoffPackage
         * @description Design handoff payload assembled from a DesignSession.
         *
         *     Always-set keys come from the session + handoff request; conditionally-set
         *     keys (design_spec, editable_file_svg, editable_file_size_bytes) populate
         *     only when session.current_spec is present and SVG export succeeds.
         */
        "HandoffPackage-Output": {
            /** Brand Assets Used */
            brand_assets_used?: string[];
            /** Conversation History */
            conversation_history?: components["schemas"]["DesignSessionMessage-Output"][];
            /** Current Mockup Url */
            current_mockup_url?: string | null;
            design_spec?: components["schemas"]["DesignSpec"] | null;
            /** Editable File Size Bytes */
            editable_file_size_bytes?: number | null;
            /** Editable File Svg */
            editable_file_svg?: string | null;
            /**
             * Iteration Count
             * @default 0
             */
            iteration_count: number;
            /**
             * Priority
             * @default normal
             */
            priority: string;
            /** Product Type */
            product_type?: string | null;
            /** Session Id */
            session_id: string;
            /**
             * User Notes
             * @default
             */
            user_notes: string;
        };
        /**
         * HealthcheckResponse
         * @description What /healthcheck reports. ``database`` is a reason class, never a credential.
         */
        HealthcheckResponse: {
            /** Database */
            database: string;
            /** Status */
            status: string;
        };
        /** HeldQueueEntry */
        HeldQueueEntry: {
            /** Age Seconds */
            age_seconds: number;
            /** Business Entity */
            business_entity?: string | null;
            /** Kind */
            kind: string;
            /** Open Holds */
            open_holds?: components["schemas"]["QueueHold"][];
            /** Order Number */
            order_number: string | null;
            /** Reference */
            reference: string;
            /** Release State */
            release_state: string | null;
            /**
             * Scan Code
             * @default
             */
            scan_code: string;
            /** Source Order Id */
            source_order_id: string | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * HelpArticle
         * @description Full help article response.
         */
        HelpArticle: {
            /** Applicable Pages */
            applicable_pages: string[];
            /** Applicable Roles */
            applicable_roles: string[];
            /** Category */
            category: string;
            /** Content */
            content: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Published */
            is_published: boolean;
            /** Summary */
            summary: string;
            /** Tags */
            tags: string[];
            /** Title */
            title: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * HelpArticleSummary
         * @description Lightweight article summary for search results and suggestions.
         */
        HelpArticleSummary: {
            /** Category */
            category: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Relevance Score
             * @default 0
             */
            relevance_score: number;
            /** Summary */
            summary: string;
            /** Tags */
            tags: string[];
            /** Title */
            title: string;
        };
        /**
         * HelpSearchRequest
         * @description Request body for searching help articles.
         */
        HelpSearchRequest: {
            /** Current Page */
            current_page?: string | null;
            /** Query */
            query: string;
        };
        /**
         * HelpSearchResponse
         * @description Response containing matching help articles and optional escalation suggestion.
         */
        HelpSearchResponse: {
            escalation_suggestion?: components["schemas"]["EscalationSuggestion"] | null;
            /** Query */
            query: string;
            /** Results */
            results: components["schemas"]["HelpArticleSummary"][];
        };
        /** HoldFromStationRequest */
        HoldFromStationRequest: {
            /** Note */
            note: string;
            /** Scanned By */
            scanned_by: string;
            /**
             * Station
             * @default
             */
            station: string;
        };
        /**
         * HoldResolution
         * @description E.3 for every reason: who approved and HOW, not merely who clicked;
         *     plus the answer where the reason has one (the band for
         *     lead_time_band_missing). Written back and remembered (H v3 §6.1).
         */
        HoldResolution: {
            /** Answer */
            answer?: string | null;
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Note */
            evidence_note: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /**
         * ImportHistoryItem
         * @description Summary for import history listing.
         */
        ImportHistoryItem: {
            /** Created At */
            created_at: string;
            /** File Name */
            file_name: string;
            /** Id */
            id: string;
            /** Import Type */
            import_type: string;
            result?: components["schemas"]["teaky_print_portal__models__schemas__data_import__ImportResult"] | null;
            /** Status */
            status: string;
        };
        /**
         * ImportSessionResponse
         * @description Returned after file upload with preview data.
         */
        ImportSessionResponse: {
            /** Created At */
            created_at: string;
            /** Detected Columns */
            detected_columns: string[];
            /** File Name */
            file_name: string;
            /** Id */
            id: string;
            /** Import Type */
            import_type: string;
            /** Optional Fields */
            optional_fields: string[];
            /** Organization Id */
            organization_id: string;
            /** Preview Rows */
            preview_rows: {
                [key: string]: unknown;
            }[];
            /** Required Fields */
            required_fields: string[];
            /** Status */
            status: string;
        };
        /**
         * InspirePoolLineSummary
         * @description A raw Inspire row as the pool read shows it.
         */
        InspirePoolLineSummary: {
            /** Art Error */
            art_error?: string | null;
            /** Art File Url */
            art_file_url?: string | null;
            /** Canonical Error */
            canonical_error?: string | null;
            /** @default pending */
            canonical_state: components["schemas"]["CanonicalLineState"];
            /** Cost Per Uom */
            cost_per_uom?: string | null;
            /** Custom Identifier */
            custom_identifier: string;
            /** Est Ship Date */
            est_ship_date?: string | null;
            /** File Url */
            file_url?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Inspire Order Number */
            inspire_order_number: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /** Line No */
            line_no: number;
            /** Order Date */
            order_date?: string | null;
            /** Order Number */
            order_number?: string | null;
            /** Pieces */
            pieces: number;
            /** Product Name */
            product_name: string;
            /** Quantity */
            quantity: number;
            /** Raw Message Url */
            raw_message_url?: string | null;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            /** Sku */
            sku: string;
            /**
             * Source Created At
             * Format: date-time
             */
            source_created_at: string;
            /**
             * Stock
             * @default
             */
            stock: string;
            /** Uom */
            uom: string;
        };
        /** Invitation */
        Invitation: {
            /** Accepted At */
            accepted_at?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Invited By
             * Format: uuid
             */
            invited_by: string;
            /** Invited Email */
            invited_email: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Portal Ids */
            portal_ids?: string[] | null;
            /** Revoked At */
            revoked_at?: string | null;
            /** Role */
            role: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * InvitationPreview
         * @description What the accept page shows before anyone signs in (S86, proper path).
         *
         *     Public by bearer token; carries nothing the invitee does not already know
         *     from the email, plus where they will land.
         */
        InvitationPreview: {
            /** Account Exists */
            account_exists: boolean;
            /** Invited Email */
            invited_email: string;
            /** Organization Name */
            organization_name: string;
            /** Portal Name */
            portal_name?: string | null;
            /** Portal Slug */
            portal_slug?: string | null;
            /** Role */
            role: string;
            /** State */
            state: string;
        };
        /**
         * InvitationTokenBody
         * @description The invitation token, carried in the request body — never in the path
         *     or query, so it reaches no access log (bead nt7z, 29 Oct 2026).
         */
        InvitationTokenBody: {
            /** Token */
            token: string;
        };
        /**
         * InvitedRegisterRequest
         * @description Set a password and take up an invitation in one step. The email is the
         *     invitation's; no organisation is created.
         */
        InvitedRegisterRequest: {
            /** Display Name */
            display_name?: string | null;
            /** Password */
            password: string;
            /** Token */
            token: string;
        };
        /** InviteTeamMemberRequest */
        InviteTeamMemberRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Portal Ids */
            portal_ids?: string[] | null;
            /** Role */
            role: string;
        };
        /** InvoiceAddress */
        InvoiceAddress: {
            /** City */
            city: string;
            /** Country */
            country: string;
            /** Line1 */
            line1: string;
            /** Line2 */
            line2: string | null;
            /** Postal Code */
            postal_code: string;
            /** State */
            state: string;
        };
        /** InvoiceCustomer */
        InvoiceCustomer: {
            address: components["schemas"]["InvoiceAddress"];
            /** Attention */
            attention?: string | null;
            /** Name */
            name: string;
            /** Phone */
            phone?: string | null;
        };
        /** InvoiceDataResponse */
        InvoiceDataResponse: {
            customer: components["schemas"]["InvoiceCustomer"];
            /** Dm Order Id */
            dm_order_id?: string | null;
            /** Generated At */
            generated_at: string;
            /** Invoice Number */
            invoice_number: string;
            /** Line Items */
            line_items: components["schemas"]["InvoiceLineItem"][];
            /** Notes */
            notes?: string | null;
            /** Order Number */
            order_number: string;
            /** Organization Name */
            organization_name: string;
            /** Payment Method */
            payment_method: string | null;
            /** Payment Status */
            payment_status: string;
            /** Placed At */
            placed_at: string;
            /** Po Number */
            po_number?: string | null;
            /** Shipping Cost */
            shipping_cost: string;
            /** Subtotal */
            subtotal: string;
            /** Tax Amount */
            tax_amount: string;
            /** Total */
            total: string;
        };
        /** InvoiceLineItem */
        InvoiceLineItem: {
            /** Color */
            color: string | null;
            /** Line Total */
            line_total: string;
            /** Product Name */
            product_name: string;
            /** Product Sku */
            product_sku: string | null;
            /** Quantity */
            quantity: number;
            /** Size */
            size: string | null;
            /** Unit Price */
            unit_price: string;
        };
        /**
         * IssueType
         * @enum {string}
         */
        IssueType: "pricing" | "order_issue" | "product_question" | "technical" | "billing" | "design" | "general";
        /**
         * LaminatorSpec
         * @description Stub — enum ``laminator``. No populated records in seed data
         *     today. Inherits only the universal base fields. Expand when
         *     enrichment populates real spec data.
         */
        LaminatorSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /**
         * LeadTimeBand
         * @description RGI's production lead-time bands, stored on the product; a line whose
         *     product has none is held (H v2 §5.1 rule 3).
         * @enum {string}
         */
        LeadTimeBand: "days_2_5" | "days_7_10";
        /**
         * LimiterMode
         * @description What an attempt gets when Redis is unreachable: through (fail-open) or refused.
         * @enum {string}
         */
        LimiterMode: "fail_open" | "fail_closed";
        /**
         * LimiterRedisState
         * @description Whether the login rate limiter can reach Redis right now (healthcheck, staff banner).
         * @enum {string}
         */
        LimiterRedisState: "ok" | "unreachable";
        /** LineItem */
        LineItem: {
            /** @default shop_held */
            art_source: components["schemas"]["ArtSource"];
            /** Artwork Change Note */
            artwork_change_note?: string | null;
            /** @default no_artwork */
            artwork_disposition: components["schemas"]["ArtworkDisposition"];
            /** Artwork Upload Url */
            artwork_upload_url?: string | null;
            /** Color */
            color?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Lane */
            lane?: string | null;
            /** Line Total */
            line_total?: number | null;
            /** Needs Proof */
            needs_proof: boolean;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /**
             * Pack Size
             * @default 1
             */
            pack_size: number;
            /**
             * Pieces
             * @description Pieces ordered: what DocketManager and the order form count.
             */
            readonly pieces: number;
            /** Price Option */
            price_option?: string | null;
            /** Product Id */
            product_id?: string | null;
            /** Product Name */
            product_name: string;
            /** Product Sku */
            product_sku?: string | null;
            /** Production Unit Id */
            production_unit_id?: string | null;
            /** Proof Status */
            proof_status?: string | null;
            /** Quantity */
            quantity: number;
            /** Received At */
            received_at?: string | null;
            /** Recipients */
            recipients?: components["schemas"]["Recipient"][];
            /** Shipment Unit Id */
            shipment_unit_id?: string | null;
            /** Size */
            size?: string | null;
            /** Source Created At */
            source_created_at?: string | null;
            /** Spec Text */
            spec_text?: string | null;
            /** Unit Price */
            unit_price?: number | null;
            /**
             * Unpriced
             * @default false
             */
            unpriced: boolean;
            /** Variable Data */
            variable_data?: components["schemas"]["VariableDatum"][];
            /**
             * Zero Quantity
             * @description Ruling izt9: the channel sent this line with no quantity (an
             *     add-on); it is on the order, produces nothing, and is never placed.
             */
            readonly zero_quantity: boolean;
        };
        /**
         * LineItemCosts
         * @description The cost basis of one line as it stood at placement, plus the manual
         *     charges staff fill when the supplier invoice arrives.
         */
        LineItemCosts: {
            /** Cost Source */
            cost_source?: string | null;
            /**
             * Cost Unknown
             * @default false
             */
            cost_unknown: boolean;
            /** Decoration Charge */
            decoration_charge?: number | null;
            /** Inbound Freight Allocation */
            inbound_freight_allocation?: number | null;
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /** Line Total */
            line_total?: number | null;
            /** Pack Size */
            pack_size: number;
            /** Product Name */
            product_name: string;
            /** Quantity */
            quantity: number;
            /** Unit Cost */
            unit_cost?: number | null;
            /** Unit Price */
            unit_price?: number | null;
        };
        /**
         * LinkDocketManagerOrderRequest
         * @description A person found the job in DocketManager after an indefinite release outcome.
         */
        LinkDocketManagerOrderRequest: {
            /** Dm Order Number */
            dm_order_number: string;
        };
        /** LinkUnitRequest */
        LinkUnitRequest: {
            /** Dm Order Number */
            dm_order_number: string;
        };
        /**
         * LocationRequest
         * @description Single location for batch portal duplication.
         */
        LocationRequest: {
            /** Custom Subdomain */
            custom_subdomain?: string | null;
            /** Location Address */
            location_address?: string | null;
            /** Location Name */
            location_name: string;
        };
        /**
         * LoginRateLimiterHealth
         * @description The limiter's dependency, as /healthcheck and the staff side see it (FAIL_OPEN
         *     ruling, 4 Nov 2026): a control that disables itself must say so. Counters are
         *     per process since start; ``degraded_since`` is set while Redis is unreachable
         *     and cleared the moment it answers again.
         */
        LoginRateLimiterHealth: {
            /** Degraded Since */
            degraded_since?: string | null;
            /**
             * Fail Closed Events
             * @default 0
             */
            fail_closed_events: number;
            /**
             * Fail Open Events
             * @default 0
             */
            fail_open_events: number;
            /** Last Event At */
            last_event_at?: string | null;
            mode: components["schemas"]["LimiterMode"];
            redis: components["schemas"]["LimiterRedisState"];
        };
        /** LoginRequest */
        LoginRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Organization Id */
            organization_id?: string | null;
            /** Password */
            password: string;
            /** Portal Slug */
            portal_slug?: string | null;
        };
        /**
         * LogoPlacement
         * @description Logo placement specification within a design.
         */
        LogoPlacement: {
            /**
             * Opacity
             * @default 1
             */
            opacity: number;
            /**
             * Position
             * @default center
             */
            position: string;
            /**
             * Scale
             * @default 1
             */
            scale: number;
        };
        /**
         * LowStockItem
         * @description A variant that is below its low-stock threshold.
         */
        LowStockItem: {
            /** Auto Reorder Enabled */
            auto_reorder_enabled: boolean;
            /** Auto Reorder Quantity */
            auto_reorder_quantity?: number | null;
            /** Color */
            color?: string | null;
            /** Low Stock Threshold */
            low_stock_threshold: number;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Product Name */
            product_name?: string | null;
            /** Size */
            size?: string | null;
            /** Sku */
            sku?: string | null;
            /** Stock Quantity */
            stock_quantity: number;
            /**
             * Variant Id
             * Format: uuid
             */
            variant_id: string;
        };
        /**
         * MailingSpec
         * @description Mailing-path machines — tabbers, labelers, wrappers, inserters,
         *     inline inkjet addressing.
         *
         *     Workflow-role category: the machine adds a mailing-path attribute
         *     (tab, label, wrap, insert, variable-data address) to pieces that
         *     were printed upstream. See ``BaseEquipmentSpec`` docstring for
         *     ``typical_products`` semantics on workflow-role machines.
         *
         *     ``resolution_dpi``, ``ink_type``, ``inline``, and
         *     ``print_swath_*`` appear because inline inkjet addressing heads
         *     (enum ``inkjet_addressing``) dispatch here and they do have
         *     imaging attributes.
         *
         *     Piece-size fields stay as free-form strings because seed data
         *     encodes ranges and narrative values ("up to 9x12 flats",
         *     "postcard (4x6)"). ``tabs_per_piece`` likewise stays as str for
         *     the one seed record's "1-3" range; see printer-agent2-mit for
         *     structuring if future records converge on consistent range
         *     semantics.
         *
         *     ``pockets`` and ``envelope_sizes`` also appear on
         *     ``FinishingSpec`` and ``PressSpec`` respectively.
         */
        MailingSpec: {
            /** Envelope Sizes */
            envelope_sizes?: string[];
            /** Ink Type */
            ink_type?: string | null;
            /** Inline */
            inline?: boolean | null;
            /** Intelligent Inserting */
            intelligent_inserting?: boolean | null;
            /** Label Type */
            label_type?: string | null;
            /** Limitations */
            limitations?: string[];
            /** Max Piece Size */
            max_piece_size?: string | null;
            /** Min Piece Size */
            min_piece_size?: string | null;
            /** Notes */
            notes?: string | null;
            /** Pockets */
            pockets?: number | null;
            /** Print Swath Common Name */
            print_swath_common_name?: string | null;
            /** Print Swath Mm */
            print_swath_mm?: number | null;
            resolution_dpi?: components["schemas"]["Resolution"] | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Speed Envelopes Per Hour */
            speed_envelopes_per_hour?: number | null;
            /** Speed Labels Per Minute */
            speed_labels_per_minute?: number | null;
            /** Speed Notes */
            speed_notes?: string | null;
            /** Speed Packages Per Minute */
            speed_packages_per_minute?: number | null;
            /** Speed Pieces Per Hour */
            speed_pieces_per_hour?: number | null;
            /** Supported Materials */
            supported_materials?: string[];
            /** Tab Type */
            tab_type?: string | null;
            /** Tabs Per Piece */
            tabs_per_piece?: string | null;
            /** Typical Products */
            typical_products: string[];
            /** Wafer Seal Capable */
            wafer_seal_capable?: boolean | null;
            /** Wrap Material */
            wrap_material?: string | null;
        };
        /** ManualPushResponse */
        ManualPushResponse: {
            /** Status */
            status: string;
            sync_log?: components["schemas"]["MISSyncLogEntry"] | null;
        };
        /**
         * MarkDoneRequest
         * @description Two steps: the first call (confirm false) answers with what would be
         *     marked and writes nothing; the second (confirm true) applies it.
         */
        MarkDoneRequest: {
            /**
             * Confirm
             * @default false
             */
            confirm: boolean;
            /** Reason */
            reason: string;
        };
        /** MarkDoneResult */
        MarkDoneResult: {
            /** Applied */
            applied: boolean;
            /** Reason */
            reason: string;
            /** Units */
            units?: components["schemas"]["MarkDoneUnit"][];
        };
        /** MarkDoneUnit */
        MarkDoneUnit: {
            /** Batch Number */
            batch_number: number;
            /** Marked Done At */
            marked_done_at?: string | null;
            /** Steps Remaining */
            steps_remaining: number;
            /**
             * Steps Skipped
             * @default 0
             */
            steps_skipped: number;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * MarkPickedRequest
         * @description Two steps: confirm false answers with what would be written and writes
         *     nothing; confirm true marks the unit picked and writes the shipping row.
         */
        MarkPickedRequest: {
            /**
             * Confirm
             * @default false
             */
            confirm: boolean;
        };
        /** MarkPickedResult */
        MarkPickedResult: {
            /** Applied */
            applied: boolean;
            /** Mixed Po Note */
            mixed_po_note?: string | null;
            /**
             * Shipping Rows
             * @default 0
             */
            shipping_rows: number;
            unit: components["schemas"]["StockedGoodsUnit"];
        };
        /** MarkReadRequest */
        MarkReadRequest: {
            /** Notification Ids */
            notification_ids: string[];
        };
        /**
         * MasterCatalogProduct
         * @description Read-only representation of a master catalog product.
         */
        MasterCatalogProduct: {
            /** Category */
            category: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Decoration Methods */
            decoration_methods?: string[];
            /** Default Variants */
            default_variants?: components["schemas"]["MasterCatalogVariant"][];
            /** Description */
            description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Image Url */
            image_url?: string | null;
            /** Is Active */
            is_active: boolean;
            /** Name */
            name: string;
            /** Product Type */
            product_type?: string | null;
            /** Subcategory */
            subcategory?: string | null;
            /** Suggested Price */
            suggested_price?: components["schemas"]["SuggestedPrice"][];
            /** Supplier */
            supplier?: string | null;
            /** Supplier Sku */
            supplier_sku?: string | null;
            /** Tags */
            tags?: string[];
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * MasterCatalogVariant
         * @description A default variant in the master catalog (size/color/price).
         */
        MasterCatalogVariant: {
            /** Color */
            color?: string | null;
            /** Cost */
            cost?: number | null;
            /** Hex Code */
            hex_code?: string | null;
            /** Size */
            size?: string | null;
            /** Supplier Sku */
            supplier_sku?: string | null;
        };
        /**
         * MeResponse
         * @description The caller's own identity for the account menu (dispatch 19 Nov 2026):
         *     the person's name and email, the organisation the session is in and the
         *     roles held there. Never anyone else's; nothing from a path parameter.
         */
        MeResponse: {
            /** Display Name */
            display_name?: string | null;
            /**
             * Email
             * Format: email
             */
            email: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Roles */
            roles: string[];
        };
        /**
         * Message
         * @description Pydantic representation of a conversation message.
         */
        Message: {
            /** Agent Task Id */
            agent_task_id: string | null;
            /** Body */
            body: string;
            /** Channel */
            channel: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Direction */
            direction: string;
            /** External Id */
            external_id: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Metadata */
            metadata_: {
                [key: string]: unknown;
            } | null;
            /** Order Id */
            order_id: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Recipient Email */
            recipient_email: string | null;
            /** Recipient Phone */
            recipient_phone: string | null;
            /** Sender Email */
            sender_email: string | null;
            /** Sender Phone */
            sender_phone: string | null;
        };
        /**
         * MISAdapterStatus
         * @description Diagnostic status from MIS adapter get_status() or
         *     test_connection error path. All fields Optional because the
         *     producer shape varies by provider and error/status branch.
         */
        MISAdapterStatus: {
            /** Account Url */
            account_url?: string | null;
            /** Connected */
            connected?: boolean | null;
            /** Csv Format */
            csv_format?: string | null;
            /** Error */
            error?: string | null;
            /** Features */
            features?: string[] | null;
            /** Features Available */
            features_available?: string[] | null;
            /** Notification Email */
            notification_email?: string | null;
            /** Provider */
            provider?: string | null;
            /** Webhook Url */
            webhook_url?: string | null;
        };
        /** MISSettingsResponse */
        MISSettingsResponse: {
            /** Mis Config */
            mis_config?: components["schemas"]["DMConfigSchema-Output"] | components["schemas"]["PrintavoConfigSchema"] | components["schemas"]["ShopVOXConfigSchema"] | components["schemas"]["GenericCSVConfigSchema"] | components["schemas"]["GenericWebhookConfigSchema"] | null;
            /** Mis Provider */
            mis_provider?: string | null;
        };
        /** MISSyncLogEntry */
        MISSyncLogEntry: {
            /** Action */
            action: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Entity Id
             * Format: uuid
             */
            entity_id: string;
            /** Entity Type */
            entity_type: string;
            /** Error Message */
            error_message?: string | null;
            /** External Id */
            external_id?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Request Payload */
            request_payload?: {
                [key: string]: unknown;
            } | null;
            /** Response Payload */
            response_payload?: {
                [key: string]: unknown;
            } | null;
            /** Status */
            status: string;
        };
        /**
         * MISSyncStatus
         * @description Status of a MIS sync operation.
         * @enum {string}
         */
        MISSyncStatus: "success" | "failed" | "pending" | "needs_template" | "held" | "needs_human";
        /**
         * MovedLineFact
         * @description a27 item 2 (ruling 20 Nov 2026): a line a short run on a full batch
         *     sends back to the pool — listed on the proposal before anything moves,
         *     and on the result once it has.
         */
        MovedLineFact: {
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /**
             * Order Ref
             * @default
             */
            order_ref: string;
            /**
             * Product
             * @default
             */
            product: string;
            /**
             * Slots
             * @default 0
             */
            slots: number;
            /** Source Created At */
            source_created_at?: string | null;
        };
        /** MoveLinesRequest */
        MoveLinesRequest: {
            /**
             * From Unit Id
             * Format: uuid
             */
            from_unit_id: string;
            /** Line Item Ids */
            line_item_ids: string[];
            /** To Unit Id */
            to_unit_id?: string | null;
        };
        /**
         * MyPortal
         * @description One portal the caller is assigned to, as the sign-in redirect needs it
         *     (belq, 30 Oct 2026): where to send a buyer, and what to call it in a
         *     chooser. Nothing a buyer must not see — no pricing, classification or
         *     revenue share.
         */
        MyPortal: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Slug */
            slug: string;
            /** Status */
            status: string;
        };
        /** Notification */
        Notification: {
            /** Context Snapshot */
            context_snapshot?: {
                [key: string]: unknown;
            } | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Email Sent At */
            email_sent_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Message */
            message: string;
            /** Read At */
            read_at?: string | null;
            /** Resource Id */
            resource_id?: string | null;
            /** Resource Type */
            resource_type?: string | null;
            /** Title */
            title: string;
            /** Type */
            type: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** NotificationPreference */
        NotificationPreference: {
            /**
             * Email Enabled
             * @default true
             */
            email_enabled: boolean;
            /** Event Type */
            event_type: string;
            /**
             * In App Enabled
             * @default true
             */
            in_app_enabled: boolean;
        };
        /** NotificationPreferencesResponse */
        NotificationPreferencesResponse: {
            /** Preferences */
            preferences: components["schemas"]["NotificationPreference"][];
        };
        /**
         * OnBehalfLineItemRequest
         * @description A catalogue line (``product_id``) or — bead hry5, ruling 5 Nov 2026 —
         *     a spec line (``spec_text``, no product): exactly one of the two. A spec
         *     line with no ``unit_price`` is UNPRICED, never 0.00; it holds its order
         *     on needs_price until a person prices it under the pricing permission.
         */
        OnBehalfLineItemRequest: {
            /** Artwork Change Note */
            artwork_change_note?: string | null;
            artwork_disposition?: components["schemas"]["ArtworkDisposition"] | null;
            /** Color */
            color?: string | null;
            /** Price Option */
            price_option?: string | null;
            /** Product Id */
            product_id?: string | null;
            /** Quantity */
            quantity: number;
            /** Recipients */
            recipients?: components["schemas"]["RecipientInput"][] | null;
            /** Size */
            size?: string | null;
            /** Spec Text */
            spec_text?: string | null;
            /** Unit Price */
            unit_price?: number | string | null;
            /** Variable Data */
            variable_data?: components["schemas"]["VariableDatumInput"][] | null;
        };
        /** OnboardingResponse */
        OnboardingResponse: {
            /** Account Id */
            account_id: string;
            /** Url */
            url: string;
        };
        /** Order */
        Order: {
            /** Approved At */
            approved_at?: string | null;
            business_entity?: components["schemas"]["BusinessEntityRef"] | null;
            /** Cancellation Reason */
            cancellation_reason?: string | null;
            /** Cancelled At */
            cancelled_at?: string | null;
            /** @default standard */
            channel: components["schemas"]["OrderChannel"];
            /** Channel Facts */
            channel_facts?: components["schemas"]["ChannelFact"][];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Delivered At */
            delivered_at?: string | null;
            /** Dm Order Id */
            dm_order_id?: string | null;
            /** Follow Ups */
            follow_ups?: components["schemas"]["ChannelFollowUp"][];
            for_whom?: components["schemas"]["OrderContact"] | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Line Items */
            line_items?: components["schemas"]["LineItem"][];
            /** Needed By */
            needed_by?: string | null;
            /** Notes */
            notes?: string | null;
            /** Order Number */
            order_number: string;
            ordering_contact?: components["schemas"]["OrderContact"] | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Payment Method */
            payment_method?: string | null;
            /** Payment Status */
            payment_status: string;
            /**
             * Placed At
             * Format: date-time
             */
            placed_at: string;
            /** Placed By Id */
            placed_by_id?: string | null;
            /** Po Number */
            po_number?: string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Production Notes */
            production_notes?: string | null;
            /** Production Status */
            production_status?: string | null;
            /** Proof Cc Email */
            proof_cc_email?: string | null;
            /** Proof Email */
            proof_email?: string | null;
            /**
             * Release Attempts
             * @default 0
             */
            release_attempts: number;
            /** Release State */
            release_state?: string | null;
            /** Release Units */
            release_units?: components["schemas"]["ReleaseUnit"][];
            /** Released At */
            released_at?: string | null;
            /** Released By Id */
            released_by_id?: string | null;
            /** Reordered From Order Id */
            reordered_from_order_id?: string | null;
            /** Rgi Order Number */
            rgi_order_number?: string | null;
            /** Shipped At */
            shipped_at?: string | null;
            shipping_address: components["schemas"]["ShippingAddress"];
            /** Shipping Cost */
            shipping_cost: number;
            /** Status */
            status: string;
            /** Stripe Payment Intent Id */
            stripe_payment_intent_id?: string | null;
            /** Subtotal */
            subtotal: number;
            /** Tags */
            tags?: string[];
            /** Tax Amount */
            tax_amount: number;
            /** Total */
            total: number;
            /** Tracking Number */
            tracking_number?: string | null;
            /**
             * Unpriced Lines
             * @description Lines with no price (ruling 9 Nov 2026): the totals exclude them.
             */
            readonly unpriced_lines: number;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /**
         * OrderChannel
         * @description Which of the client's sales channels an order belongs to (S84).
         *
         *     Captured unconditionally at placement because it cannot be reconstructed
         *     for a month already elapsed (proposed-baseline-dormancy-rule.md): every
         *     portal order is STANDARD; MANAGED is set by staff when they enter an order
         *     from the client's managed channel on a customer's behalf.
         * @enum {string}
         */
        OrderChannel: "standard" | "managed" | "taylor" | "pagedna" | "inspire";
        /**
         * OrderContact
         * @description A person on an order (Part B, 5 Nov 2026): a name plus the contact
         *     shape every contact here carries — title, email, phone. The ordering
         *     contact and who the order is for; the ship-to is ``ShippingAddress``.
         */
        OrderContact: {
            /** Email */
            email?: string | null;
            /** Name */
            name: string;
            /** Phone */
            phone?: string | null;
            /** Title */
            title?: string | null;
        };
        /** OrderCosts */
        OrderCosts: {
            /** Invoice Month */
            invoice_month?: string | null;
            /** Lines */
            lines?: components["schemas"]["LineItemCosts"][];
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Order Number */
            order_number: string;
            /** Outbound Freight Cost */
            outbound_freight_cost?: number | null;
            /** Processing Fee Actual */
            processing_fee_actual?: number | null;
            /** Processing Fee Source */
            processing_fee_source?: string | null;
            /** Revenue Share Rate Snapshot */
            revenue_share_rate_snapshot?: number | null;
            /** Status */
            status: string;
        };
        /** OrderCountDataPoint */
        OrderCountDataPoint: {
            /** Count */
            count: number;
            /** Period */
            period: string;
        };
        /** OrderFile */
        OrderFile: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** File Category */
            file_category: string;
            /** File Size Bytes */
            file_size_bytes: number;
            /** File Url */
            file_url: string;
            /** Filename */
            filename: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Mime Type */
            mime_type: string;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            preflight_report?: components["schemas"]["PreflightResult"] | null;
            preflight_status?: components["schemas"]["PreflightStatus"] | null;
            /**
             * Uploaded By Id
             * Format: uuid
             */
            uploaded_by_id: string;
        };
        /**
         * OrderShipment
         * @description What the order row says left the building; absent until it has.
         */
        OrderShipment: {
            /**
             * Carrier
             * @default
             */
            carrier: string;
            /**
             * Shipped At
             * Format: date-time
             */
            shipped_at: string;
            /**
             * Tracking
             * @default
             */
            tracking: string;
        };
        /** OrdersOverTimeResponse */
        OrdersOverTimeResponse: {
            /** Data */
            data: components["schemas"]["OrderCountDataPoint"][];
            granularity: components["schemas"]["TimeGranularity"];
        };
        /** OrderStatusBreakdown */
        OrderStatusBreakdown: {
            /** Count */
            count: number;
            /** Status */
            status: string;
        };
        /** OrderSyncStatus */
        OrderSyncStatus: {
            /** Dm Order Id */
            dm_order_id?: string | null;
            /** Error Message */
            error_message?: string | null;
            /** Last Sync At */
            last_sync_at?: string | null;
            /** Last Sync Status */
            last_sync_status?: string | null;
        };
        /**
         * OrderTagList
         * @description The shop's tag list: every tag on any of its orders plus every tag its
         *     rules would add — the union, derived, not stored (the design note names
         *     no stored list). Sorted case-insensitively for the pickers.
         */
        OrderTagList: {
            /** Tags */
            tags: string[];
        };
        /** OrderWhereabouts */
        OrderWhereabouts: {
            /**
             * Business Entity
             * @default
             */
            business_entity: string;
            /** Channel */
            channel: string;
            /**
             * Customer
             * @default
             */
            customer: string;
            last_scan?: components["schemas"]["ScanEvent"] | null;
            /** Lines */
            lines?: components["schemas"]["WhereaboutsLine"][];
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Order Number */
            order_number: string;
            /** Order Ref */
            order_ref: string;
            /**
             * Placed At
             * Format: date-time
             */
            placed_at: string;
            /** Pushes */
            pushes?: components["schemas"]["WhereaboutsPush"][];
            /** Release State */
            release_state?: string | null;
            shipped?: components["schemas"]["OrderShipment"] | null;
            /** Status */
            status: string;
            /** Tags */
            tags?: string[];
            /** Units */
            units?: components["schemas"]["WhereaboutsUnit"][];
            /** Waiting On */
            waiting_on?: string[];
        };
        /**
         * OrganizationCapabilitySet
         * @description Request to replace all capabilities for an organization.
         */
        OrganizationCapabilitySet: {
            /** Capability Ids */
            capability_ids: string[];
        };
        /** OrganizationEquipment */
        OrganizationEquipment: {
            /**
             * Added At
             * Format: date-time
             */
            added_at: string;
            /**
             * Equipment Id
             * Format: uuid
             */
            equipment_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Notes */
            notes?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Quantity */
            quantity: number;
        };
        /**
         * OrganizationMe
         * @description What a signed-in printer-side user may know about their organisation.
         *
         *     ``is_managed`` marks an account Teaky sets up and runs on negotiated terms
         *     (RGI Publications is the first): the self-serve surfaces — the Get Started
         *     wizard, the plan step, the "create your first portal" prompt — stand down.
         */
        OrganizationMe: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Managed */
            is_managed: boolean;
            /** Name */
            name: string;
        };
        /** PageDnaFileRowSummary */
        PageDnaFileRowSummary: {
            /** Canonical Error */
            canonical_error?: string | null;
            /** @default pending */
            canonical_state: components["schemas"]["CanonicalLineState"];
            /**
             * File Id
             * Format: uuid
             */
            file_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Job Reference */
            job_reference: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /** Line No */
            line_no: number;
            /** Order Number */
            order_number?: string | null;
            /** Product Key */
            product_key: string;
            /** Quantity */
            quantity?: number | null;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            ship_to?: components["schemas"]["ShippingAddress"] | null;
            /** Token */
            token: string;
        };
        /**
         * PageDnaFileStatus
         * @enum {string}
         */
        PageDnaFileStatus: "stored" | "refused";
        /** PageDnaFileSummary */
        PageDnaFileSummary: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /**
             * Pull Id
             * Format: uuid
             */
            pull_id: string;
            /** Reason */
            reason?: string | null;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            /** Remote Modified At */
            remote_modified_at?: string | null;
            /** Remote Path */
            remote_path: string;
            /**
             * Rows
             * @default 0
             */
            rows: number;
            /** Sha256 */
            sha256: string;
            /** Size */
            size: number;
            status: components["schemas"]["PageDnaFileStatus"];
        };
        /**
         * PageDnaPollStatus
         * @enum {string}
         */
        PageDnaPollStatus: "ok" | "failed";
        /** PageDnaPollSummary */
        PageDnaPollSummary: {
            /**
             * Emails Parsed
             * @default 0
             */
            emails_parsed: number;
            /**
             * Emails Rejected
             * @default 0
             */
            emails_rejected: number;
            /** Error */
            error?: string | null;
            /**
             * Files Stored
             * @default 0
             */
            files_stored: number;
            /** Finished At */
            finished_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Lines Blocked
             * @default 0
             */
            lines_blocked: number;
            /**
             * Lines New
             * @default 0
             */
            lines_new: number;
            /**
             * Lines Upserted
             * @default 0
             */
            lines_upserted: number;
            /**
             * Lines Written
             * @default 0
             */
            lines_written: number;
            /**
             * Messages Duplicate
             * @default 0
             */
            messages_duplicate: number;
            /**
             * Messages Quarantined
             * @default 0
             */
            messages_quarantined: number;
            /**
             * Messages Seen
             * @default 0
             */
            messages_seen: number;
            /**
             * Orders Written
             * @default 0
             */
            orders_written: number;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            status: components["schemas"]["PageDnaPollStatus"];
            trigger: components["schemas"]["PageDnaPollTrigger"];
        };
        /**
         * PageDnaPollTrigger
         * @enum {string}
         */
        PageDnaPollTrigger: "manual" | "schedule";
        /** PageDnaPoolLineSummary */
        PageDnaPoolLineSummary: {
            /** Art File Url */
            art_file_url?: string | null;
            /** Canonical Error */
            canonical_error?: string | null;
            /** @default pending */
            canonical_state: components["schemas"]["CanonicalLineState"];
            /** Description */
            description: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Item Ref */
            item_ref: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /** Line No */
            line_no: number;
            /** Order Date */
            order_date?: string | null;
            /** Order Number */
            order_number?: string | null;
            /** Order Ref */
            order_ref: string;
            /** Product Key */
            product_key: string;
            /** Program */
            program: string;
            /** Quantity */
            quantity: number;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            /** Shiplabel File Url */
            shiplabel_file_url?: string | null;
            /**
             * Source Created At
             * Format: date-time
             */
            source_created_at: string;
            /**
             * Stock
             * @default
             */
            stock: string;
        };
        /**
         * PageDnaSftpPullSummary
         * @description One run, live from ``pull()`` or read back from its row.
         */
        PageDnaSftpPullSummary: {
            /** By User Id */
            by_user_id?: string | null;
            /** Error */
            error?: string | null;
            /**
             * Files Duplicate
             * @default 0
             */
            files_duplicate: number;
            /**
             * Files Listed
             * @default 0
             */
            files_listed: number;
            /**
             * Files New
             * @default 0
             */
            files_new: number;
            /**
             * Files Refused
             * @default 0
             */
            files_refused: number;
            /** Finished At */
            finished_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Lines Blocked
             * @default 0
             */
            lines_blocked: number;
            /**
             * Lines Written
             * @default 0
             */
            lines_written: number;
            /**
             * Orders Written
             * @default 0
             */
            orders_written: number;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Rows Seen
             * @default 0
             */
            rows_seen: number;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            status: components["schemas"]["PullStatus"];
            trigger: components["schemas"]["PullTrigger"];
            /** Warning */
            warning?: string | null;
        };
        /**
         * PartitionKey
         * @description The key a partition strategy formed a unit on (H v3 §5.0). Each
         *     strategy fills the fields it uses; a later strategy adds fields here rather
         *     than columns, and its value domain is strings — never an enum or a check
         *     constraint. Extra keys from an older or newer strategy are kept, not
         *     dropped, so a stored key always reads back whole.
         */
        PartitionKey: {
            /** Lead Time Band */
            lead_time_band?: string | null;
            /** Needs Proof */
            needs_proof?: boolean | null;
            /** Outsourced Product Id */
            outsourced_product_id?: string | null;
            /** Sides */
            sides?: string | null;
            /** Size */
            size?: string | null;
            /** Stock */
            stock?: string | null;
            /**
             * Strategy
             * @default single
             */
            strategy: string;
        } & {
            [key: string]: unknown;
        };
        /**
         * PasswordChangedWire
         * @description The route's answer: the access token in the body, the refresh token in
         *     the cookie (item 6).
         */
        PasswordChangedWire: {
            /** Access Token */
            access_token: string;
            /**
             * Credentials Changed At
             * Format: date-time
             */
            credentials_changed_at: string;
            /**
             * Expires In
             * @description Access token expiry in seconds
             */
            expires_in: number;
            /** Other Sessions Ended */
            other_sessions_ended: number;
            /**
             * Token Type
             * @default bearer
             */
            token_type: string;
        };
        /** PasswordResetConfirmBody */
        PasswordResetConfirmBody: {
            /** New Password */
            new_password: string;
            /** Token */
            token: string;
        };
        /** PasswordResetConfirmResponse */
        PasswordResetConfirmResponse: {
            /** Detail */
            detail: string;
            /**
             * Sessions Ended
             * @description Refresh tokens revoked; access tokens expire within 15 minutes
             */
            sessions_ended: number;
        };
        /**
         * PasswordResetRequestBody
         * @description Ask for a reset link. The portal the person signed in from brands the
         *     email; it is optional and never changes who gets the link.
         */
        PasswordResetRequestBody: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Portal Slug */
            portal_slug?: string | null;
        };
        /**
         * PasswordResetRequestResponse
         * @description The one answer every request gets, whether or not the address has an
         *     account (no enumeration).
         */
        PasswordResetRequestResponse: {
            /** Detail */
            detail: string;
        };
        /**
         * PendingBundle
         * @description A released unit's bundle the bridge has not written yet. The zip's root
         *     folder is the batch folder name ("Batch N tag stock"); the bridge reads
         *     it from the zip, verifies sha256 against this before writing.
         */
        PendingBundle: {
            /**
             * File Id
             * Format: uuid
             */
            file_id: string;
            /** Filename */
            filename: string;
            /**
             * Generated At
             * Format: date-time
             */
            generated_at: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * PlacePoolResult
         * @description What one explicit run of the press-run placer over the shop's pool did
         *     (dispatch 16 Nov 2026): the placer's counts, nothing else. ``changed``
         *     False is the idempotent answer over an unchanged record.
         */
        PlacePoolResult: {
            /**
             * Changed
             * @default false
             */
            changed: boolean;
            /**
             * Full Units
             * @default 0
             */
            full_units: number;
            /**
             * Holds Closed
             * @default 0
             */
            holds_closed: number;
            /**
             * Holds Opened
             * @default 0
             */
            holds_opened: number;
            /**
             * Lines Placed
             * @default 0
             */
            lines_placed: number;
            /**
             * Lines Returned To Pool
             * @default 0
             */
            lines_returned_to_pool: number;
            /**
             * Placements Added
             * @default 0
             */
            placements_added: number;
            /**
             * Placements Removed
             * @default 0
             */
            placements_removed: number;
            /**
             * Units Created
             * @default 0
             */
            units_created: number;
        };
        /** PlatformAnalytics */
        PlatformAnalytics: {
            /** Active Portal Count */
            active_portal_count: number;
            /** Active Printer Count */
            active_printer_count: number;
            /** Agent Completion Rate */
            agent_completion_rate: number | null;
            /** Agent Task Count */
            agent_task_count: number;
            /** Avg Agent Confidence */
            avg_agent_confidence: number | null;
            /** Total Gmv */
            total_gmv: number;
            /** Total Order Count */
            total_order_count: number;
            /** Total User Count */
            total_user_count: number;
        };
        /**
         * PlatformFeedbackSummary
         * @description Cross-org platform-wide feedback summary for super admin.
         */
        PlatformFeedbackSummary: {
            /** Explicit Count */
            explicit_count: number;
            /** Implicit Count */
            implicit_count: number;
            /** Org Count */
            org_count: number;
            /** Thumbs Up Rate */
            thumbs_up_rate: number;
            /** Total Signals */
            total_signals: number;
        };
        /**
         * PlaybookBudgetGuidance
         * @description Budget guidance with three tiers.
         */
        PlaybookBudgetGuidance: {
            /** Economy */
            economy: {
                [key: string]: unknown;
            };
            /** Premium */
            premium: {
                [key: string]: unknown;
            };
            /**
             * Scaling Note
             * @default
             */
            scaling_note: string;
            /** Standard */
            standard: {
                [key: string]: unknown;
            };
        };
        /**
         * PlaybookCreatedProduct
         * @description Portal product created by a playbook application.
         *
         *     Carries the id and name so callers can record per-product provenance
         *     without a separate lookup.
         */
        PlaybookCreatedProduct: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
        };
        /**
         * PlaybookDesignTheme
         * @description Design direction for the playbook.
         */
        PlaybookDesignTheme: {
            /**
             * Color Direction
             * @default
             */
            color_direction: string;
            /**
             * Imagery Suggestions
             * @default
             */
            imagery_suggestions: string;
            /**
             * Mood
             * @default
             */
            mood: string;
            /**
             * Typography Style
             * @default
             */
            typography_style: string;
        };
        /**
         * PlaybookProductSpec
         * @description A single product specification within a playbook.
         */
        PlaybookProductSpec: {
            /** Base Quantity */
            base_quantity: number;
            budget_tier_prices?: components["schemas"]["BudgetTierPrices"];
            /** Category Group */
            category_group: string;
            /** Decoration Method */
            decoration_method?: string | null;
            /** Notes */
            notes?: string | null;
            /** Product Name */
            product_name: string;
            /** Product Type */
            product_type: string;
            /** Scaling Formula */
            scaling_formula: string;
            /** Size Distribution */
            size_distribution?: components["schemas"]["SizeFraction"][] | null;
        };
        /**
         * PlaybookResponse
         * @description Full playbook template response.
         */
        PlaybookResponse: {
            budget_guidance?: components["schemas"]["PlaybookBudgetGuidance"] | null;
            /** Category */
            category: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Created By Id */
            created_by_id?: string | null;
            /** Default Scale */
            default_scale: number;
            /** Description */
            description: string;
            design_theme?: components["schemas"]["PlaybookDesignTheme"] | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Active */
            is_active: boolean;
            /** Name */
            name: string;
            /** Organization Id */
            organization_id?: string | null;
            /** Pro Tips */
            pro_tips?: string[] | null;
            /** Products */
            products: {
                [key: string]: unknown;
            }[];
            /** Scaling Variable */
            scaling_variable: string;
            /** Tier */
            tier: string;
            /** Timeline */
            timeline?: {
                [key: string]: unknown;
            }[] | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Usage Count */
            usage_count: number;
        };
        /**
         * PlaybookTimelineStep
         * @description A step in the playbook production timeline.
         */
        PlaybookTimelineStep: {
            /** Action */
            action: string;
            /** Notes */
            notes?: string | null;
            /** Products To Order */
            products_to_order?: string[];
            /** Weeks Before Event */
            weeks_before_event: number;
        };
        /** PoolLineSummary */
        PoolLineSummary: {
            /** Art Error */
            art_error?: string | null;
            art_state: components["schemas"]["ArtState"];
            /** Canonical Error */
            canonical_error?: string | null;
            /** @default pending */
            canonical_state: components["schemas"]["CanonicalLineState"];
            /** Cards */
            cards: number;
            /**
             * Customer
             * @default
             */
            customer: string;
            /** Held By */
            held_by?: string[];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Lane
             * @default
             */
            lane: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /** Line No */
            line_no: number;
            /** Order Number */
            order_number?: string | null;
            /** Pack */
            pack: number;
            /** Po */
            po: string;
            /** Product */
            product: string;
            /** Quantity */
            quantity: number;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            /**
             * Source Created At
             * Format: date-time
             */
            source_created_at: string;
            /**
             * Stock
             * @default
             */
            stock: string;
        };
        /** Portal */
        Portal: {
            /** Approval Workflow */
            approval_workflow: string;
            /** Archived At */
            archived_at?: string | null;
            brand_config?: components["schemas"]["BrandConfig"] | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Created Via */
            created_via: string;
            /** Custom Domain */
            custom_domain?: string | null;
            customer_classification?: components["schemas"]["CustomerClassification"] | null;
            /**
             * Duplication Count
             * @default 0
             */
            duplication_count: number;
            /** Expires At */
            expires_at?: string | null;
            /**
             * Fundraiser Allow Donations
             * @default false
             */
            fundraiser_allow_donations: boolean;
            /** Fundraiser Cause Amount Per Item */
            fundraiser_cause_amount_per_item?: number | null;
            /** Fundraiser Cause Description */
            fundraiser_cause_description?: string | null;
            /** Fundraiser End Date */
            fundraiser_end_date?: string | null;
            /** Fundraiser Goal Amount */
            fundraiser_goal_amount?: number | null;
            /** Fundraiser Organizer Name */
            fundraiser_organizer_name?: string | null;
            /**
             * Fundraiser Raised Amount
             * @default 0
             */
            fundraiser_raised_amount: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Inactivity Notification Count
             * @default 0
             */
            inactivity_notification_count: number;
            /** Inactivity Notified At */
            inactivity_notified_at?: string | null;
            /**
             * Is Fundraiser
             * @default false
             */
            is_fundraiser: boolean;
            /**
             * Is Template
             * @default false
             */
            is_template: boolean;
            /** Last Order At */
            last_order_at?: string | null;
            /**
             * Lifecycle Status
             * @default active
             */
            lifecycle_status: string;
            /** Name */
            name: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Paused At */
            paused_at?: string | null;
            /** Require Po */
            require_po: boolean;
            /** Revenue Share Rate */
            revenue_share_rate?: string | null;
            /** Self Registration */
            self_registration: boolean;
            /** Slug */
            slug: string;
            /** Status */
            status: string;
            /** Template Portal Id */
            template_portal_id?: string | null;
            /** Type */
            type: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** PortalAssignment */
        PortalAssignment: {
            /**
             * Assigned At
             * Format: date-time
             */
            assigned_at: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
        };
        /** PortalInviteRequest */
        PortalInviteRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /**
             * Role
             * @default end_user
             */
            role: string;
        };
        /** PortalPerformance */
        PortalPerformance: {
            /** Order Count */
            order_count: number;
            /** Portal Id */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
            /** Total Revenue */
            total_revenue: number;
        };
        /** PortalPerformanceResponse */
        PortalPerformanceResponse: {
            /** Portals */
            portals: components["schemas"]["PortalPerformance"][];
        };
        /** PortalRegisterRequest */
        PortalRegisterRequest: {
            /** Email */
            email: string;
            /** Password */
            password: string;
        };
        /**
         * PreflightIssue
         * @description A single preflight validation issue with fix suggestion.
         */
        PreflightIssue: {
            /** Actual */
            actual: string;
            /** Expected */
            expected: string;
            /**
             * Fix Suggestion
             * @default
             */
            fix_suggestion: string;
            /** Message */
            message: string;
            /** Rule */
            rule: string;
            severity: components["schemas"]["PreflightSeverity"];
        };
        /**
         * PreflightReportResponse
         * @description Route-level response from preflight validation.
         */
        PreflightReportResponse: {
            /**
             * Checks Run
             * @default 0
             */
            checks_run: number;
            /** File Info */
            file_info?: components["schemas"]["RasterFileInfo"] | components["schemas"]["VectorFileInfo"] | null;
            /** Issues */
            issues?: {
                [key: string]: unknown;
            }[];
            /** Passed */
            passed: boolean;
            /**
             * Summary
             * @default
             */
            summary: string;
        };
        /**
         * PreflightRequest
         * @description Route-level request for preflight validation.
         */
        PreflightRequest: {
            /** Allowed Formats */
            allowed_formats?: string[];
            /** Max File Size Bytes */
            max_file_size_bytes?: number | null;
            /**
             * Min Bleed Px
             * @default 0
             */
            min_bleed_px: number;
            /**
             * Min Dpi
             * @default 300
             */
            min_dpi: number;
            /** Required Color Mode */
            required_color_mode?: string | null;
        };
        /**
         * PreflightResult
         * @description Result of preflight validation.
         *
         *     Summary fields category and severity are rolled up from issues during
         *     validation (roll-up logic lives in preflight_checker.run_preflight and
         *     the validate() entry point added per jnz8.2.16.2). Consumers reading
         *     them get the oqj.1 escalation contract pattern without per-caller
         *     re-derivation.
         */
        PreflightResult: {
            /** Category */
            category?: string | null;
            /**
             * Checks Run
             * @default 0
             */
            checks_run: number;
            /** File Info */
            file_info?: components["schemas"]["RasterFileInfo"] | components["schemas"]["VectorFileInfo"] | null;
            /** Issues */
            issues?: components["schemas"]["PreflightIssue"][];
            /** Passed */
            passed: boolean;
            severity?: components["schemas"]["PreflightSeverity"] | null;
            /**
             * Summary
             * @default
             */
            summary: string;
        };
        /**
         * PreflightSeverity
         * @description Severity level for a preflight issue or rolled-up result.
         * @enum {string}
         */
        PreflightSeverity: "error" | "warning" | "info";
        /**
         * PreflightStatus
         * @description Status of preflight validation persisted on an OrderFile.
         *
         *     Distinct from PreflightSeverity (rolled-up severity of issues within
         *     a single PreflightResult). PreflightStatus records the outcome of the
         *     preflight run itself at the OrderFile boundary.
         *
         *     Values:
         *     - PASSED: preflight ran and all checks passed
         *     - FAILED: preflight ran and at least one check failed
         *     - ERROR: preflight raised an exception during execution
         * @enum {string}
         */
        PreflightStatus: "passed" | "failed" | "error";
        /**
         * PrePressSpec
         * @description Stub — enum ``prepress``. No populated records in seed data
         *     today. Inherits only the universal base fields. Expand when
         *     enrichment populates real spec data.
         */
        PrePressSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /**
         * PressRunConfig
         * @description Per-shop batching configuration (C1): not constants. Lives on the shop's
         *     organisation row (``organizations.press_run_config``) beside its other
         *     settings; absent → these defaults, which are Andrew's rules.
         */
        "PressRunConfig-Input": {
            /**
             * Auto Push When Full
             * @default false
             */
            auto_push_when_full: boolean;
            /**
             * Bridge Bundles Enabled
             * @default false
             */
            bridge_bundles_enabled: boolean;
            /**
             * Cards Per Slot
             * @default 250
             */
            cards_per_slot: number;
            /** Channels */
            channels?: components["schemas"]["ChannelConfig"][];
            /** Customer Tags */
            customer_tags?: components["schemas"]["CustomerTagRule"][];
            /**
             * Docket Item Codes
             * @default {}
             */
            docket_item_codes: {
                [key: string]: string;
            };
            /**
             * Docket Send Enabled
             * @default false
             */
            docket_send_enabled: boolean;
            /**
             * Docket Singles Item Codes
             * @default {}
             */
            docket_singles_item_codes: {
                [key: string]: string;
            };
            /**
             * First Unit Number
             * @default 101
             */
            first_unit_number: number;
            /**
             * Gang Whole Orders
             * @default true
             */
            gang_whole_orders: boolean;
            /**
             * Half Capacity
             * @default 12
             */
            half_capacity: number;
            /**
             * Half Sheets Per Run
             * @default 125
             */
            half_sheets_per_run: number;
            /**
             * Hold Age Days
             * @default 2
             */
            hold_age_days: number;
            /**
             * Partition Strategy
             * @default press_run
             */
            partition_strategy: string;
            /** @default cards */
            production_view: components["schemas"]["ProductionView"];
            /**
             * Require Second Approver
             * @default false
             */
            require_second_approver: boolean;
            /**
             * Sheets Per Run
             * @default 250
             */
            sheets_per_run: number;
            shipping_csv?: components["schemas"]["ShippingCsvConfig"];
            /**
             * Shop Name
             * @default
             */
            shop_name: string;
            /**
             * Slots Per Unit
             * @default 24
             */
            slots_per_unit: number;
            /**
             * Split When Unplaceable
             * @default true
             */
            split_when_unplaceable: boolean;
            /** Stocked Goods Prefixes */
            stocked_goods_prefixes?: string[];
        } & {
            [key: string]: unknown;
        };
        /**
         * PressRunConfig
         * @description Per-shop batching configuration (C1): not constants. Lives on the shop's
         *     organisation row (``organizations.press_run_config``) beside its other
         *     settings; absent → these defaults, which are Andrew's rules.
         */
        "PressRunConfig-Output": {
            /**
             * Auto Push When Full
             * @default false
             */
            auto_push_when_full: boolean;
            /**
             * Bridge Bundles Enabled
             * @default false
             */
            bridge_bundles_enabled: boolean;
            /**
             * Cards Per Slot
             * @default 250
             */
            cards_per_slot: number;
            /** Channels */
            channels?: components["schemas"]["ChannelConfig"][];
            /** Customer Tags */
            customer_tags?: components["schemas"]["CustomerTagRule"][];
            /**
             * Docket Item Codes
             * @default {}
             */
            docket_item_codes: {
                [key: string]: string;
            };
            /**
             * Docket Send Enabled
             * @default false
             */
            docket_send_enabled: boolean;
            /**
             * Docket Singles Item Codes
             * @default {}
             */
            docket_singles_item_codes: {
                [key: string]: string;
            };
            /**
             * First Unit Number
             * @default 101
             */
            first_unit_number: number;
            /**
             * Gang Whole Orders
             * @default true
             */
            gang_whole_orders: boolean;
            /**
             * Half Capacity
             * @default 12
             */
            half_capacity: number;
            /**
             * Half Sheets Per Run
             * @default 125
             */
            half_sheets_per_run: number;
            /**
             * Hold Age Days
             * @default 2
             */
            hold_age_days: number;
            /**
             * Partition Strategy
             * @default press_run
             */
            partition_strategy: string;
            /** @default cards */
            production_view: components["schemas"]["ProductionView"];
            /**
             * Require Second Approver
             * @default false
             */
            require_second_approver: boolean;
            /**
             * Sheets Per Run
             * @default 250
             */
            sheets_per_run: number;
            shipping_csv?: components["schemas"]["ShippingCsvConfig"];
            /**
             * Shop Name
             * @default
             */
            shop_name: string;
            /**
             * Slots Per Unit
             * @default 24
             */
            slots_per_unit: number;
            /**
             * Split When Unplaceable
             * @default true
             */
            split_when_unplaceable: boolean;
            /** Stocked Goods Prefixes */
            stocked_goods_prefixes?: string[];
        } & {
            [key: string]: unknown;
        };
        /**
         * PressRunConfigSeedRequest
         * @description The whole press-run configuration to seed, as read from the source
         *     shop by someone allowed to read it; the route writes it to the caller's
         *     shop. A dry run shows the keys that would change.
         */
        PressRunConfigSeedRequest: {
            config: components["schemas"]["PressRunConfig-Input"];
            /**
             * Dry Run
             * @default true
             */
            dry_run: boolean;
        };
        /** PressRunConfigSeedResult */
        PressRunConfigSeedResult: {
            after: components["schemas"]["PressRunConfig-Output"];
            before: components["schemas"]["PressRunConfig-Output"];
            /** Changed Keys */
            changed_keys: string[];
            /** Dry Run */
            dry_run: boolean;
            /** Written */
            written: boolean;
        };
        /**
         * PressSpec
         * @description Product-producing presses — digital_press, offset, envelope_press,
         *     web_offset, dtf.
         *
         *     Stock-thickness, cutoff, and web-speed fields follow the H-3
         *     metric-canonical pattern: numeric field in SI units plus an optional
         *     ``*_common_name`` string capturing the industry-conventional form
         *     (e.g. "22.75 in"). ``resolution_dpi`` is the structured
         *     ``Resolution`` subfield (H-2). Square-feet-per-hour throughput uses
         *     the structured ``SpeedSqFtPerHour`` subfield (H-5).
         *
         *     Paper weight is the H-3 EXCEPTION. Pounds do not cleanly convert to
         *     gsm because "30 lb text" and "30 lb cover" differ materially in grams
         *     per square meter (different basis-sheet sizes per paper type). The
         *     schema therefore accepts both representations natively — ``*_gsm``
         *     fields for unambiguous metric specs, ``*_lb`` fields for US-industry
         *     paper-type-dependent specs (e.g. the Harris M1000A Heatset Web, which
         *     runs mixed paper bases). The two pairs are independent; callers
         *     populate whichever the source documentation quotes. See bead
         *     printer-agent2-c65 decision 1, H-3 PAPER WEIGHT EXCEPTION note.
         *
         *     ``envelope_sizes`` appears here for envelope-capable offset presses;
         *     the same field is also present on ``MailingSpec`` for inserters.
         */
        PressSpec: {
            /** Coating Type */
            coating_type?: string | null;
            /** Color Channels */
            color_channels?: string[];
            /** Cutoff Common Name */
            cutoff_common_name?: string | null;
            /** Cutoff Mm */
            cutoff_mm?: number | null;
            /** Drying */
            drying?: string | null;
            /** Duplex */
            duplex?: boolean | null;
            /** Duty Cycle Pages Per Month */
            duty_cycle_pages_per_month?: number | null;
            /** Envelope Capable */
            envelope_capable?: boolean | null;
            /** Envelope Sizes */
            envelope_sizes?: string[];
            /** Ink Type */
            ink_type?: string | null;
            /** Inline Coater */
            inline_coater?: boolean | null;
            /** Limitations */
            limitations?: string[];
            /** Max Paper Weight Common Name */
            max_paper_weight_common_name?: string | null;
            /** Max Paper Weight Gsm */
            max_paper_weight_gsm?: number | null;
            /** Max Paper Weight Lb */
            max_paper_weight_lb?: number | null;
            /** Max Paper Weight Lb Common Name */
            max_paper_weight_lb_common_name?: string | null;
            /** Max Stock Thickness Mm */
            max_stock_thickness_mm?: number | null;
            /** Media Type */
            media_type?: string | null;
            /** Min Paper Weight Common Name */
            min_paper_weight_common_name?: string | null;
            /** Min Paper Weight Gsm */
            min_paper_weight_gsm?: number | null;
            /** Min Paper Weight Lb */
            min_paper_weight_lb?: number | null;
            /** Min Paper Weight Lb Common Name */
            min_paper_weight_lb_common_name?: string | null;
            /** Monochrome */
            monochrome?: boolean | null;
            /** Notes */
            notes?: string | null;
            /** Printheads */
            printheads?: string | null;
            /** Requires Heat Press */
            requires_heat_press?: boolean | null;
            resolution_dpi?: components["schemas"]["Resolution"] | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Speed Impressions Per Hour */
            speed_impressions_per_hour?: number | null;
            /** Speed Notes */
            speed_notes?: string | null;
            /** Speed Ppm */
            speed_ppm?: number | null;
            speed_sq_ft_per_hour?: components["schemas"]["SpeedSqFtPerHour"] | null;
            /** Supported Materials */
            supported_materials?: string[];
            /** Toner Type */
            toner_type?: string | null;
            /** Transfer Media */
            transfer_media?: string | null;
            /** Typical Products */
            typical_products: string[];
            /** Web Speed Common Name */
            web_speed_common_name?: string | null;
            /** Web Speed M Per Min */
            web_speed_m_per_min?: number | null;
        };
        /**
         * PriceAnswer
         * @description Bead hry5: the answer to a needs_price hold — the price per pack, with
         *     the same evidence every hold decision carries (who approved and how).
         *     Written to the line (unit_price, line_total, unpriced false) and the
         *     order's totals; the hold closes as ``priced`` with who and when.
         */
        PriceAnswer: {
            /** Evidence Kind */
            evidence_kind: string;
            /** Evidence Note */
            evidence_note: string;
            /** Unit Price */
            unit_price: number | string;
        };
        /**
         * PriceOptionInput
         * @description What an admin sends for an option; server-owned state is not settable.
         */
        PriceOptionInput: {
            /** Cost */
            cost?: number | string | null;
            /** Floor Multiplier */
            floor_multiplier?: number | string | null;
            /** Label */
            label: string;
            /** Price */
            price: number | string;
        };
        /**
         * PriceOptionView
         * @description An option as the printer admin sees it, with its effective markup.
         */
        PriceOptionView: {
            /**
             * Below Floor
             * @default false
             */
            below_floor: boolean;
            /** Cost */
            cost?: number | null;
            /** Effective Multiplier */
            effective_multiplier?: string | null;
            /**
             * Floor Alert Pending
             * @default false
             */
            floor_alert_pending: boolean;
            /** Floor Multiplier */
            floor_multiplier?: string | null;
            floor_state?: components["schemas"]["FloorState"];
            /** Label */
            label: string;
            /** Price */
            price: number;
            /** Price Confirmed At */
            price_confirmed_at?: string | null;
        };
        /**
         * PricingStrategy
         * @enum {string}
         */
        PricingStrategy: "use_suggested" | "apply_markup" | "manual";
        /** PricingTier */
        "PricingTier-Input": {
            /** Max Qty */
            max_qty?: number | null;
            /** Min Qty */
            min_qty: number;
            /** Unit Price */
            unit_price: number | string;
        };
        /** PricingTier */
        "PricingTier-Output": {
            /** Max Qty */
            max_qty?: number | null;
            /** Min Qty */
            min_qty: number;
            /** Unit Price */
            unit_price: number;
        };
        /**
         * PrintavoConfigSchema
         * @description Config for Printavo GraphQL integration.
         */
        PrintavoConfigSchema: {
            /** Api Token */
            api_token: string;
            /**
             * Auto Push On Approval
             * @default true
             */
            auto_push_on_approval: boolean;
            /** Shop Email */
            shop_email: string;
        };
        /**
         * PriorDecision
         * @description The latest decision a person made on the same case (H v3 §6.2).
         */
        PriorDecision: {
            /** Answer */
            answer?: string | null;
            /**
             * Decided At
             * Format: date-time
             */
            decided_at: string;
            /**
             * Decided By Id
             * Format: uuid
             */
            decided_by_id: string;
            /** Evidence Kind */
            evidence_kind?: string | null;
        };
        /** Product */
        Product: {
            /** Base Cost */
            base_cost?: number | null;
            /** Base Price */
            base_price?: number | null;
            /**
             * Below Floor
             * @default false
             */
            below_floor: boolean;
            /** Category */
            category: string;
            /** Category Id */
            category_id?: string | null;
            /**
             * Collects Recipients
             * @default false
             */
            collects_recipients: boolean;
            /** Colors */
            colors?: components["schemas"]["ColorOption"][];
            /** Cost Source */
            cost_source?: string | null;
            /** Cost Source Url */
            cost_source_url?: string | null;
            /**
             * Cost Unknown
             * @default false
             */
            cost_unknown: boolean;
            /** Cost Updated At */
            cost_updated_at?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Description */
            description?: string | null;
            /** Dm External Id */
            dm_external_id?: string | null;
            /** Effective Multiplier */
            effective_multiplier?: string | null;
            /**
             * Floor Alert Pending
             * @default false
             */
            floor_alert_pending: boolean;
            /** Floor Multiplier */
            floor_multiplier?: string | null;
            floor_state?: components["schemas"]["FloorState"];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Lead Time Band */
            lead_time_band?: string | null;
            /** Margin Percent */
            margin_percent?: string | null;
            /** Markup Multiplier */
            markup_multiplier?: string | null;
            /** Max Order Quantity */
            max_order_quantity?: number | null;
            /** Min Order Qty */
            min_order_qty: number;
            /** Mockup Urls */
            mockup_urls?: string[];
            /** Name */
            name: string;
            /** Option Set Name */
            option_set_name?: string | null;
            /**
             * Outsourced
             * @default false
             */
            outsourced: boolean;
            /** Pack Price */
            pack_price?: number | null;
            /**
             * Pack Size
             * @default 1
             */
            pack_size: number;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Previous Dm Order Number */
            previous_dm_order_number?: string | null;
            /** Price Confirmed At */
            price_confirmed_at?: string | null;
            /**
             * Price Locked
             * @default false
             */
            price_locked: boolean;
            /** Price Options */
            price_options?: components["schemas"]["PriceOptionView"][];
            /** Pricing Tiers */
            pricing_tiers?: components["schemas"]["PricingTier-Output"][];
            /** Proof Required */
            proof_required: boolean;
            /** Safe Order Eligible */
            safe_order_eligible: boolean;
            /** Sizes */
            sizes?: components["schemas"]["SizeOption-Output"][];
            /** Sku */
            sku?: string | null;
            /** Sort Order */
            sort_order: number;
            source_tier?: components["schemas"]["ProductSourceTier"] | null;
            /** Status */
            status: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * ProductionPdfRequest
         * @description Route-level request for production PDF generation.
         */
        ProductionPdfRequest: {
            /**
             * Bleed Px
             * @default 36
             */
            bleed_px: number;
            /**
             * Include Color Bars
             * @default true
             */
            include_color_bars: boolean;
            /**
             * Include File Info
             * @default true
             */
            include_file_info: boolean;
        };
        /**
         * ProductionPdfResponse
         * @description Route-level response from production PDF generation.
         */
        ProductionPdfResponse: {
            /**
             * Bleed Px
             * @default 0
             */
            bleed_px: number;
            /**
             * Format
             * @default PDF
             */
            format: string;
            /**
             * Has Color Bars
             * @default false
             */
            has_color_bars: boolean;
            /**
             * Has Crop Marks
             * @default false
             */
            has_crop_marks: boolean;
            /**
             * Has File Info
             * @default false
             */
            has_file_info: boolean;
            /**
             * Height Px
             * @default 0
             */
            height_px: number;
            /**
             * Output Base64
             * @default
             */
            output_base64: string;
            /** Success */
            success: boolean;
            /**
             * Width Px
             * @default 0
             */
            width_px: number;
        };
        /**
         * ProductionSettings
         * @description The shop's production rules (Part A, 5 Nov 2026): the press-run
         *     switches and hold age from ``press_run_config``, the production-side
         *     name, and the tenant's timezone (``organizations.timezone``).
         */
        ProductionSettings: {
            /**
             * Auto Push When Full
             * @default false
             */
            auto_push_when_full: boolean;
            /**
             * Bridge Bundles Enabled
             * @default false
             */
            bridge_bundles_enabled: boolean;
            /** Gang Whole Orders */
            gang_whole_orders: boolean;
            /** Hold Age Days */
            hold_age_days: number;
            /** @default cards */
            production_view: components["schemas"]["ProductionView"];
            /** Shop Name */
            shop_name: string;
            /** Split When Unplaceable */
            split_when_unplaceable: boolean;
            /** Timezone */
            timezone: string;
        };
        /**
         * ProductionShell
         * @description What the production shell shows for the signed-in organisation (ruling
         *     18 Nov 2026, from the +shadowprobe walk): its name, and its mark — the
         *     company profile's logo, else Teaky's own — never a constant for every
         *     shop. Readable by every production reader, the shadow_reader included;
         *     nothing in it is a setting, a cost or a contact.
         */
        ProductionShell: {
            mark: components["schemas"]["EmailMark"];
            /** Name */
            name: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
        };
        /**
         * ProductionStatusUpdate
         * @description Request to update production status manually.
         */
        ProductionStatusUpdate: {
            /** Notes */
            notes?: string | null;
            /** Production Status */
            production_status: string;
        };
        /** ProductionStatusUpdateResponse */
        ProductionStatusUpdateResponse: {
            /** Order Id */
            order_id: string;
            /** Production Status */
            production_status: string;
        };
        /**
         * ProductionView
         * @description How a shop's Batches page opens (a26, 18 Nov 2026): the card layout
         *     (RGI) or the list (Single Source). A per-browser toggle overrides it.
         * @enum {string}
         */
        ProductionView: "cards" | "list";
        /**
         * ProductNeedingTemplate
         * @description A product with no DocketManager External Identifier — the template queue.
         */
        ProductNeedingTemplate: {
            /** Name */
            name: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Portal Slug */
            portal_slug: string;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Sku */
            sku: string | null;
            /** Status */
            status: string;
        };
        /**
         * ProductResolutionDetail
         * @description Per-product provenance record for a store creation run.
         *
         *     Lets the caller distinguish confidently-sourced products (catalog or
         *     knowledge base) from estimated shell products whose pricing and specs
         *     need human review before the store goes live.
         */
        ProductResolutionDetail: {
            /** Is Estimated Pricing */
            is_estimated_pricing: boolean;
            /** Note */
            note?: string | null;
            /** Product Id */
            product_id?: string | null;
            /** Requested Name */
            requested_name: string;
            /** Resolved Name */
            resolved_name: string;
            source_tier: components["schemas"]["ProductSourceTier"];
        };
        /**
         * ProductSourceTier
         * @description Resolution tier that produced a portal product during store creation.
         *
         *     Used to distinguish confidently-sourced products (real catalog or
         *     knowledge base matches) from estimated shell products generated as a
         *     fallback when nothing matched.
         * @enum {string}
         */
        ProductSourceTier: "catalog" | "knowledge_base" | "fallback" | "playbook";
        /**
         * ProductStockResponse
         * @description Stock availability for all variants of a product.
         */
        ProductStockResponse: {
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Variants */
            variants?: components["schemas"]["VariantStockInfo"][];
        };
        /**
         * ProductTypeInfo
         * @description A product type with its template dimensions and decoration areas.
         */
        ProductTypeInfo: {
            /** Decoration Areas */
            decoration_areas: components["schemas"]["DecorationAreaInfo"][];
            /** Height */
            height: number;
            /** Label */
            label: string;
            /** Product Type */
            product_type: string;
            /** Width */
            width: number;
        };
        /** ProductVariant */
        ProductVariant: {
            /**
             * Auto Reorder Enabled
             * @default false
             */
            auto_reorder_enabled: boolean;
            /** Auto Reorder Quantity */
            auto_reorder_quantity?: number | null;
            /** Color */
            color?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Active */
            is_active: boolean;
            /**
             * Low Stock Threshold
             * @default 20
             */
            low_stock_threshold: number;
            /** Price Override */
            price_override?: number | null;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Size */
            size?: string | null;
            /** Sku */
            sku?: string | null;
            /** Stock Quantity */
            stock_quantity?: number | null;
            /**
             * Track Inventory
             * @default false
             */
            track_inventory: boolean;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** Proof */
        Proof: {
            /** Approved By Name */
            approved_by_name?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** File Url */
            file_url?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Rejection Reason */
            rejection_reason?: string | null;
            /** Reviewed At */
            reviewed_at?: string | null;
            /** Reviewed By */
            reviewed_by?: string | null;
            /** Signature Data */
            signature_data?: string | null;
            /** Specs */
            specs?: {
                [key: string]: unknown;
            } | null;
            /** Status */
            status: string;
            /** Submitted By */
            submitted_by?: string | null;
            /** Thumbnail Url */
            thumbnail_url?: string | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Version */
            version: number;
        };
        /**
         * ProposalUnitFact
         * @description One unit the target touches, as it stood when the proposal was made.
         */
        ProposalUnitFact: {
            /**
             * Cancelled
             * @default false
             */
            cancelled: boolean;
            /** Docket Number */
            docket_number?: string | null;
            /**
             * Formation
             * @default
             */
            formation: string;
            /**
             * Kind
             * @default
             */
            kind: string;
            /**
             * Pushed Out
             * @default false
             */
            pushed_out: boolean;
            /**
             * Reference
             * @default
             */
            reference: string;
            /** Release State */
            release_state?: string | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** ProposeActionRequest */
        ProposeActionRequest: {
            category?: components["schemas"]["PushAloneReason"] | null;
            kind: components["schemas"]["ActionProposalKind"];
            /**
             * Note
             * @default
             */
            note: string;
            /** Reason */
            reason: string;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["ActionProposalTarget"];
        };
        /** ProposeAdminActionRequest */
        ProposeAdminActionRequest: {
            kind: components["schemas"]["AdminProposalKind"];
            /** New Role */
            new_role?: string | null;
            /**
             * Note
             * @default
             */
            note: string;
            /** Reason */
            reason: string;
            /**
             * Target Id
             * Format: uuid
             */
            target_id: string;
            target_kind: components["schemas"]["AdminProposalTarget"];
        };
        /**
         * PublicFundraiserResponse
         * @description Public-facing fundraiser data (no auth required).
         */
        PublicFundraiserResponse: {
            /** Allow Donations */
            allow_donations: boolean;
            /** Cause Amount Per Item */
            cause_amount_per_item: number;
            /** Cause Description */
            cause_description: string;
            /** Days Remaining */
            days_remaining?: number | null;
            /** End Date */
            end_date?: string | null;
            /** Goal Amount */
            goal_amount: number;
            /** Organizer Name */
            organizer_name: string;
            /** Percentage Complete */
            percentage_complete: number;
            /** Portal Name */
            portal_name: string;
            /** Raised Amount */
            raised_amount: number;
        };
        /**
         * PublicFundraiserSupporter
         * @description A supporter as shown on the public fundraiser page.
         *
         *     Whitelist, not the record: no supporter id, portal id or order id. Served
         *     without authentication, so every field here is public by definition.
         */
        PublicFundraiserSupporter: {
            /** Amount */
            amount: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Is Donation
             * @default false
             */
            is_donation: boolean;
            /** Supporter Name */
            supporter_name: string;
        };
        /**
         * PublicPortalResponse
         * @description Reduced portal response for end-users.
         */
        PublicPortalResponse: {
            brand_config?: components["schemas"]["BrandConfig"] | null;
            /**
             * Fundraiser Allow Donations
             * @default false
             */
            fundraiser_allow_donations: boolean;
            /** Fundraiser Cause Amount Per Item */
            fundraiser_cause_amount_per_item?: number | null;
            /** Fundraiser Cause Description */
            fundraiser_cause_description?: string | null;
            /** Fundraiser End Date */
            fundraiser_end_date?: string | null;
            /** Fundraiser Goal Amount */
            fundraiser_goal_amount?: number | null;
            /** Fundraiser Organizer Name */
            fundraiser_organizer_name?: string | null;
            /** Fundraiser Raised Amount */
            fundraiser_raised_amount?: number | null;
            /**
             * Is Fundraiser
             * @default false
             */
            is_fundraiser: boolean;
            /** Name */
            name: string;
            /**
             * Require Po
             * @default false
             */
            require_po: boolean;
            /** Slug */
            slug: string;
            /** Status */
            status: string;
            /** Timezone */
            timezone: string;
            /** Type */
            type: string;
        };
        /**
         * PublicPriceOption
         * @description An option as a buyer sees it: the label and the published price only.
         */
        PublicPriceOption: {
            /** Label */
            label: string;
            /** Price */
            price: number;
        };
        /**
         * PublicProduct
         * @description What leaves the server for a buyer or an unauthenticated caller.
         *
         *     A whitelist, not a filter: cost, markup, floor, margin state, vendor
         *     source, price lock, source tier and the DocketManager identifier are
         *     never in it (S87 security fix — they were public on /p/{slug}/products).
         */
        PublicProduct: {
            /** Base Price */
            base_price?: number | null;
            /** Category */
            category: string;
            /** Category Id */
            category_id?: string | null;
            /**
             * Collects Recipients
             * @default false
             */
            collects_recipients: boolean;
            /** Colors */
            colors?: components["schemas"]["ColorOption"][];
            /** Description */
            description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Max Order Quantity */
            max_order_quantity?: number | null;
            /** Min Order Qty */
            min_order_qty: number;
            /** Mockup Urls */
            mockup_urls?: string[];
            /** Name */
            name: string;
            /** Option Set Name */
            option_set_name?: string | null;
            /** Pack Price */
            pack_price?: number | null;
            /**
             * Pack Size
             * @default 1
             */
            pack_size: number;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Price Options */
            price_options?: components["schemas"]["PublicPriceOption"][];
            /** Pricing Tiers */
            pricing_tiers?: components["schemas"]["PricingTier-Output"][];
            /** Proof Required */
            proof_required: boolean;
            /** Sizes */
            sizes?: components["schemas"]["SizeOption-Output"][];
            /** Sku */
            sku?: string | null;
            /** Sort Order */
            sort_order: number;
            /** Status */
            status: string;
        };
        /**
         * PullStatus
         * @enum {string}
         */
        PullStatus: "running" | "ok" | "warning" | "session_expired" | "failed";
        /**
         * PullSummary
         * @description One run. Returned live by ``pull()`` with every count, and read back
         *     from the run's row (``GET /intake/taylor/pulls/{id}``) with the same
         *     counts (s89_31, dispatch 16 Nov 2026); a row written before the counts
         *     existed reads ``None`` for them, never a false 0.
         */
        PullSummary: {
            /**
             * Art Fetched
             * @default 0
             */
            art_fetched: number | null;
            /**
             * Art Held
             * @default 0
             */
            art_held: number | null;
            /** By User Id */
            by_user_id?: string | null;
            /** Error */
            error?: string | null;
            /** Finished At */
            finished_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Lines Blocked
             * @default 0
             */
            lines_blocked: number | null;
            /**
             * Lines New
             * @default 0
             */
            lines_new: number | null;
            /**
             * Lines Upserted
             * @default 0
             */
            lines_upserted: number;
            /**
             * Lines Written
             * @default 0
             */
            lines_written: number | null;
            /**
             * Orders Header Only
             * @default 0
             */
            orders_header_only: number | null;
            /**
             * Orders Seen
             * @default 0
             */
            orders_seen: number;
            /**
             * Orders Written
             * @default 0
             */
            orders_written: number | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Since Day */
            since_day: string;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            status: components["schemas"]["PullStatus"];
            trigger: components["schemas"]["PullTrigger"];
            /** Warning */
            warning?: string | null;
        };
        /**
         * PullTrigger
         * @enum {string}
         */
        PullTrigger: "manual" | "schedule";
        /**
         * PurchaseRequest
         * @description Route request body for POST /shipping/purchase.
         */
        PurchaseRequest: {
            from_address: components["schemas"]["EasyPostAddress"];
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            parcel?: components["schemas"]["EasyPostParcel"] | null;
            /** Rate Id */
            rate_id: string;
            to_address: components["schemas"]["EasyPostAddress"];
        };
        /**
         * PushAloneReason
         * @description D3 (Andrew, 6 Nov 2026): why an order goes out as a batch of one.
         * @enum {string}
         */
        PushAloneReason: "rush" | "stock" | "finishing" | "other";
        /** PushAloneRequest */
        PushAloneRequest: {
            /**
             * Note
             * @default
             */
            note: string;
            reason: components["schemas"]["PushAloneReason"];
        };
        /** PushAloneResult */
        PushAloneResult: {
            /** Batch Number */
            batch_number: number;
            /** Lines */
            lines: number;
            /**
             * Note
             * @default
             */
            note: string;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            reason: components["schemas"]["PushAloneReason"];
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** PushOutFile */
        PushOutFile: {
            /** Filename */
            filename: string;
            /** Kind */
            kind: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
        };
        /**
         * PushOutPreview
         * @description Everything the person sees before confirming: the unit, its slots and
         *     blanks, the files that would go, the exact Docket payload that would be
         *     sent (or why it cannot be built), and the state of the send switch.
         */
        PushOutPreview: {
            /** Batch Number */
            batch_number: number;
            /** Blanks */
            blanks: number;
            /** Capacity */
            capacity: number;
            /** Docket Host */
            docket_host?: string | null;
            /** Docket Send Enabled */
            docket_send_enabled: boolean;
            /** Existing Docket Number */
            existing_docket_number?: string | null;
            /** Files */
            files?: components["schemas"]["PushOutFile"][];
            /**
             * Half
             * @default false
             */
            half: boolean;
            /** Lines */
            lines: number;
            /** Lines Moved */
            lines_moved?: components["schemas"]["MovedLineFact"][];
            /** Orders */
            orders: number;
            payload?: components["schemas"]["DocketPayload"] | null;
            /** Payload Problem */
            payload_problem?: string | null;
            /** Payload Sha256 */
            payload_sha256?: string | null;
            /** Payload Xml */
            payload_xml?: string | null;
            placer?: components["schemas"]["PlacePoolResult"] | null;
            /**
             * Sheets Per Run
             * @default 250
             */
            sheets_per_run: number;
            /** Stock */
            stock: string;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
            /** Used */
            used: number;
        };
        /** PushOutResult */
        PushOutResult: {
            /**
             * Attempted At
             * Format: date-time
             */
            attempted_at: string;
            /** Docket Number */
            docket_number?: string | null;
            /** Docket Send Enabled */
            docket_send_enabled: boolean;
            /**
             * Needs Human
             * @default false
             */
            needs_human: boolean;
            /** Payload Sha256 */
            payload_sha256?: string | null;
            /** Reason */
            reason?: string | null;
            /** Release State */
            release_state?: string | null;
            /** Sent */
            sent: boolean;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * QAMode
         * @description QA check modes configurable per organization.
         * @enum {string}
         */
        QAMode: "full" | "sampling" | "off" | "draft";
        /** QBOConnectionStatus */
        QBOConnectionStatus: {
            /** Connected */
            connected: boolean;
            /** Connected At */
            connected_at?: string | null;
            /** Realm Id */
            realm_id?: string | null;
            /** Status */
            status?: string | null;
        };
        /** QBOConnectUrlResponse */
        QBOConnectUrlResponse: {
            /** Authorization Url */
            authorization_url: string;
        };
        /**
         * QBOOAuthCallback
         * @description Response from OAuth authorization code exchange.
         */
        QBOOAuthCallback: {
            /** Connected */
            connected: boolean;
            /** Organization Id */
            organization_id: string;
            /** Realm Id */
            realm_id: string;
        };
        /** QBOSyncConfigRequest */
        QBOSyncConfigRequest: {
            /**
             * Attach Pdf
             * @default true
             */
            attach_pdf: boolean;
            /**
             * Cc Printer
             * @default false
             */
            cc_printer: boolean;
            /**
             * Default Payment Terms
             * @default Net 30
             */
            default_payment_terms: string;
            /**
             * Send To Field
             * @default order_email
             */
            send_to_field: string;
        };
        /** QBOSyncConfigResponse */
        QBOSyncConfigResponse: {
            /** Attach Pdf */
            attach_pdf: boolean;
            /** Cc Printer */
            cc_printer: boolean;
            /** Default Payment Terms */
            default_payment_terms: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Send To Field */
            send_to_field: string;
        };
        /** QBOSyncLogResponse */
        QBOSyncLogResponse: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Error Message */
            error_message?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Metadata Json */
            metadata_json?: {
                [key: string]: unknown;
            } | null;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Qbo Entity Id */
            qbo_entity_id?: string | null;
            /** Qbo Entity Type */
            qbo_entity_type: string;
            /** Retry Count */
            retry_count: number;
            /** Status */
            status: string;
            /** Sync Type */
            sync_type: string;
        };
        /**
         * QualityCheckResult
         * @description Result of a brand asset quality check.
         */
        QualityCheckResult: {
            /**
             * Asset Id
             * Format: uuid
             */
            asset_id: string;
            /** Details */
            details: components["schemas"]["RasterQualityDetails"] | components["schemas"]["SvgQualityDetails"] | components["schemas"]["UnsupportedFormatDetails"];
            /** Quality Status */
            quality_status: string;
        };
        /** QueueHold */
        QueueHold: {
            /** Case Key */
            case_key?: string | null;
            /** Detail */
            detail?: string | null;
            /**
             * Hold Id
             * Format: uuid
             */
            hold_id: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /** Opened At */
            opened_at?: string | null;
            prior_decision?: components["schemas"]["PriorDecision"] | null;
            /** Reason */
            reason: string;
        };
        /** QueueMappingEntry */
        QueueMappingEntry: {
            /** Dm Queue Name */
            dm_queue_name: string;
            /** Teaky Status */
            teaky_status: string;
        };
        /** QueueMappingsResponse */
        QueueMappingsResponse: {
            /** Queue Mapping */
            queue_mapping: {
                [key: string]: string;
            };
        };
        /** QuoteRequest */
        QuoteRequest: {
            /** Assigned To Id */
            assigned_to_id?: string | null;
            /** Converted Order Id */
            converted_order_id?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Description */
            description: string;
            /** Desired Date */
            desired_date?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Notes */
            notes?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Product Id */
            product_id?: string | null;
            /** Quantity */
            quantity: number;
            /** Quoted At */
            quoted_at?: string | null;
            /** Quoted Price */
            quoted_price?: number | null;
            /**
             * Requested By Id
             * Format: uuid
             */
            requested_by_id: string;
            /** Status */
            status: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** QuoteRequestPage */
        QuoteRequestPage: {
            /** Items */
            items: components["schemas"]["QuoteRequest"][];
            /** Page */
            page: number;
            /** Page Size */
            page_size: number;
            /** Total */
            total: number;
        };
        /**
         * RasterFileInfo
         * @description File info for raster image preflight (produced by
         *     preflight_checker.py:367).
         */
        RasterFileInfo: {
            /** Color Mode */
            color_mode: string;
            /** Dpi */
            dpi?: number | null;
            /** Format */
            format?: string | null;
            /** Height Px */
            height_px: number;
            /** Width Px */
            width_px: number;
        };
        /**
         * RasterQualityDetails
         * @description Quality-check details for raster image assets (Pattern 3b variant).
         */
        RasterQualityDetails: {
            /** Color Mode */
            color_mode?: string | null;
            /** Dpi */
            dpi?: number | null;
            /** Error */
            error?: string | null;
            /** Format */
            format: string;
            /** Has Alpha */
            has_alpha?: boolean | null;
            /** Height Px */
            height_px?: number | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "raster";
            /** Width Px */
            width_px?: number | null;
        };
        /**
         * RateRequest
         * @description Route request body for POST /shipping/rates.
         */
        RateRequest: {
            from_address: components["schemas"]["EasyPostAddress"];
            parcel?: components["schemas"]["EasyPostParcel"] | null;
            to_address: components["schemas"]["EasyPostAddress"];
        };
        /**
         * Recipient
         * @description A person named on a variable-data item (a business card, a Guest Services
         *     card): one per pack ordered. Typed so a subject-access or deletion request is
         *     a query, not a search through order notes (s89_02).
         *
         *     Read shape. ``email`` and ``phone`` were added on 2026-10-26 (Jeni's review
         *     of the buyer guide: a card needs name, title, email and phone); rows written
         *     before then hold ``{name, title}`` only, so both are optional here and the
         *     write shape (``RecipientInput``) requires them. ``cart_items.recipients`` and
         *     ``line_items.recipients`` are JSONB — no migration.
         */
        Recipient: {
            /** Email */
            email?: string | null;
            /** Name */
            name: string;
            /** Phone */
            phone?: string | null;
            /** Title */
            title?: string | null;
        };
        /**
         * RecipientInput
         * @description What a buyer must supply per pack: name, title (optional), email and
         *     phone — the four things the card carries, so the desk never re-keys them
         *     by phone (ruling 2026-10-26).
         */
        RecipientInput: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Name */
            name: string;
            /** Phone */
            phone: string;
            /** Title */
            title?: string | null;
        };
        /**
         * RefreshBody
         * @description POST /auth/refresh and /auth/logout: the refresh token is the cookie;
         *     the body names the organisation to keep, if any.
         */
        RefreshBody: {
            /** Organization Id */
            organization_id?: string | null;
        };
        /** RegisterRequest */
        RegisterRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Organization Name */
            organization_name: string;
            /** Password */
            password: string;
        };
        /** RejectProofRequest */
        RejectProofRequest: {
            /** Reason */
            reason: string;
        };
        /**
         * ReleaseUnit
         * @description One release unit: a shipment unit (lines that ship and invoice
         *     together; carries the money) or a production unit (lines that print
         *     together; carries the DocketManager outcome). ``reference`` is the unit's
         *     identity reference, derived from ``references`` for display.
         */
        ReleaseUnit: {
            /** Assigned At */
            assigned_at?: string | null;
            /**
             * Assigned By
             * @default planner
             */
            assigned_by: string;
            /** Assigned By User Id */
            assigned_by_user_id?: string | null;
            /** Cancel Reason */
            cancel_reason?: string | null;
            /** Cancelled At */
            cancelled_at?: string | null;
            /** Channel */
            channel: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Formation */
            formation: string;
            /**
             * Freight
             * @default 0
             */
            freight: string;
            /** Frozen At */
            frozen_at?: string | null;
            /** Holds */
            holds?: components["schemas"]["ReleaseUnitHold"][];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Kind */
            kind: string;
            /** Line Item Ids */
            line_item_ids?: string[];
            /**
             * Ordinal
             * @default 1
             */
            ordinal: number;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            partition_key?: components["schemas"]["PartitionKey"] | null;
            /** Portal Id */
            portal_id?: string | null;
            /** Reference */
            reference: string;
            /** References */
            references?: components["schemas"]["ExternalReference"][];
            /**
             * Release Attempts
             * @default 0
             */
            release_attempts: number;
            /** Release State */
            release_state?: string | null;
            /** Released At */
            released_at?: string | null;
            /** Released By Id */
            released_by_id?: string | null;
            /** Source Order Id */
            source_order_id?: string | null;
            /**
             * Subtotal
             * @default 0
             */
            subtotal: string;
            /**
             * Tax
             * @default 0
             */
            tax: string;
            /**
             * Total
             * @default 0
             */
            total: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ReleaseUnitHold */
        ReleaseUnitHold: {
            /** Answer */
            answer?: string | null;
            /** Case Key */
            case_key?: string | null;
            /** Cleared At */
            cleared_at?: string | null;
            /** Cleared By Id */
            cleared_by_id?: string | null;
            /** Cleared How */
            cleared_how?: string | null;
            /** Detail */
            detail?: string | null;
            /** Evidence Kind */
            evidence_kind?: string | null;
            /** Evidence Note */
            evidence_note?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Line Item Id */
            line_item_id?: string | null;
            /**
             * Opened At
             * Format: date-time
             */
            opened_at: string;
            /** Opened By */
            opened_by: string;
            prior_decision?: components["schemas"]["PriorDecision"] | null;
            /** Reason */
            reason: string;
        };
        /**
         * ReleaseUnitRead
         * @description GET /release-units/{id} (ruling 11 Nov 2026): one production unit as
         *     the list shows it, with the Docket payload a push would send — or why it
         *     cannot be built — and the payload's sha256 for a cross-check. No files,
         *     no host, no XML: the per-unit read a ``production:shadow_read`` holder
         *     may have. Nothing is sent.
         */
        ReleaseUnitRead: {
            business_entity?: components["schemas"]["BusinessEntityRef"] | null;
            payload?: components["schemas"]["DocketPayload"] | null;
            /** Payload Problem */
            payload_problem?: string | null;
            /** Payload Sha256 */
            payload_sha256?: string | null;
            summary: components["schemas"]["BatchSummary"];
        };
        /**
         * ReorderRecommendation
         * @description AI-generated reorder recommendation.
         */
        ReorderRecommendation: {
            /** Bulk Savings Estimate */
            bulk_savings_estimate?: number | null;
            /** Optimal Order Date */
            optimal_order_date: string;
            /** Predicted Quantity */
            predicted_quantity: number;
            /** Product Id */
            product_id?: string | null;
            /** Product Name */
            product_name: string;
            /** Reasoning */
            reasoning: string;
        };
        /** RepPerformance */
        RepPerformance: {
            /** Average Order Value */
            average_order_value: number;
            /** Avg Response Time Hours */
            avg_response_time_hours: number | null;
            /** Email */
            email: string;
            /** Escalation Count */
            escalation_count: number;
            /** Order Count */
            order_count: number;
            /** Proof Approval Rate */
            proof_approval_rate: number | null;
            /** Role */
            role: string;
            /** Total Revenue */
            total_revenue: number;
            /** User Id */
            user_id: string;
        };
        /** RepriceLine */
        RepriceLine: {
            /** Base Cost */
            base_cost?: number | null;
            /** Category */
            category: string;
            /** Name */
            name: string;
            /** New Price */
            new_price?: number | null;
            /** Old Price */
            old_price?: number | null;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            skipped?: components["schemas"]["RepriceSkipReason"] | null;
            /** Sku */
            sku?: string | null;
        };
        /**
         * RepriceRequest
         * @description Bulk reprice: every matching product gets base_price = base_cost + margin.
         */
        RepriceRequest: {
            /**
             * Category
             * @description Limit to one product category; omit for the whole portal
             */
            category?: string | null;
            /**
             * Dry Run
             * @description Preview only; write nothing
             * @default true
             */
            dry_run: boolean;
            /**
             * Include Locked
             * @description Also overwrite prices a human set by hand
             * @default false
             */
            include_locked: boolean;
            /** Margin Percent */
            margin_percent: number | string;
        };
        /** RepriceResult */
        RepriceResult: {
            /** Category */
            category?: string | null;
            /** Dry Run */
            dry_run: boolean;
            /** Lines */
            lines?: components["schemas"]["RepriceLine"][];
            /** Margin Percent */
            margin_percent: string;
            /** Matched */
            matched: number;
            /** Repriced */
            repriced: number;
            /** Skipped */
            skipped: number;
        };
        /**
         * RepriceSkipReason
         * @enum {string}
         */
        RepriceSkipReason: "no_base_cost" | "price_locked";
        /**
         * Resolution
         * @description Print resolution in DPI, split into horizontal and vertical axes.
         *
         *     Replaces the legacy string ``resolution_dpi`` field that encoded
         *     composite values. Records that historically stored a single scalar
         *     ("2400") migrate to horizontal=vertical=2400. The ``notes`` field
         *     captures free-form qualifiers like "6-pass".
         */
        Resolution: {
            /** Horizontal Dpi */
            horizontal_dpi: number;
            /** Notes */
            notes?: string | null;
            /** Vertical Dpi */
            vertical_dpi: number;
        };
        /** RespondToEscalationRequest */
        RespondToEscalationRequest: {
            /** Message */
            message: string;
            /** @default resolved */
            status: components["schemas"]["EscalationStatus"];
        };
        /** RevenueDataPoint */
        RevenueDataPoint: {
            /** Period */
            period: string;
            /** Revenue */
            revenue: number;
        };
        /** RevenueOverTimeResponse */
        RevenueOverTimeResponse: {
            /** Data */
            data: components["schemas"]["RevenueDataPoint"][];
            granularity: components["schemas"]["TimeGranularity"];
        };
        /**
         * RouteOwnerKind
         * @enum {string}
         */
        RouteOwnerKind: "station" | "vendor";
        /** RouteStep */
        RouteStep: {
            /** By User Id */
            by_user_id?: string | null;
            /** Due Back */
            due_back?: string | null;
            /** Entered At */
            entered_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Left At */
            left_at?: string | null;
            /** Name */
            name: string;
            /** Note */
            note?: string | null;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Owner Id */
            owner_id?: string | null;
            owner_kind: components["schemas"]["RouteOwnerKind"];
            /** Position */
            position: number;
            /**
             * Production Unit Id
             * Format: uuid
             */
            production_unit_id: string;
            /** Returned At */
            returned_at?: string | null;
            /** Sent At */
            sent_at?: string | null;
            state: components["schemas"]["RouteStepState"];
        };
        /**
         * RouteStepState
         * @enum {string}
         */
        RouteStepState: "pending" | "at" | "done" | "out" | "returned" | "skipped";
        /**
         * RoutingOptionsResponse
         * @description Response from get_routing_options.
         */
        RoutingOptionsResponse: {
            /** Issue Type */
            issue_type?: string | null;
            /** Options */
            options: components["schemas"]["EscalationOption"][];
            /** Page Context */
            page_context?: string | null;
        };
        /** SafeOrderCheckResponse */
        SafeOrderCheckResponse: {
            /** Is Safe Order */
            is_safe_order: boolean;
        };
        /**
         * SandboxTestRequest
         * @description Request to run a sandbox test message.
         */
        SandboxTestRequest: {
            /**
             * Channel
             * @default sms
             */
            channel: string;
            /** Message */
            message: string;
        };
        /**
         * SandboxTestResponse
         * @description Response from a sandbox test.
         */
        SandboxTestResponse: {
            /** Agents Dispatched */
            agents_dispatched: string[];
            /** Confidence */
            confidence: number;
            /** Escalated */
            escalated: boolean;
            /** Response */
            response: string;
        };
        /**
         * ScaledPlaybookResult
         * @description Result of scaling a playbook to a specific size and budget tier.
         */
        ScaledPlaybookResult: {
            /** Budget By Category */
            budget_by_category: components["schemas"]["CategoryBudget"][];
            /** Budget Tier */
            budget_tier: string;
            /**
             * Playbook Id
             * Format: uuid
             */
            playbook_id: string;
            /** Playbook Name */
            playbook_name: string;
            /** Pro Tips */
            pro_tips?: string[] | null;
            /** Products */
            products: components["schemas"]["ScaledProduct"][];
            /** Scale Value */
            scale_value: number;
            /** Timeline */
            timeline?: {
                [key: string]: unknown;
            }[] | null;
            /** Total Budget */
            total_budget: number;
        };
        /**
         * ScaledProduct
         * @description A product with scaled quantity and pricing.
         */
        ScaledProduct: {
            /** Category Group */
            category_group: string;
            /** Decoration Method */
            decoration_method?: string | null;
            /** Line Total */
            line_total: number;
            /** Notes */
            notes?: string | null;
            /** Product Name */
            product_name: string;
            /** Product Type */
            product_type: string;
            /** Quantity */
            quantity: number;
            /** Size Distribution */
            size_distribution?: components["schemas"]["SizeQuantity"][] | null;
            /** Unit Price */
            unit_price: number;
        };
        /** ScalePlaybookBody */
        ScalePlaybookBody: {
            /**
             * Budget Tier
             * @default standard
             */
            budget_tier: string;
            /** Scale Value */
            scale_value: number;
        };
        /** ScanEvent */
        ScanEvent: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /** Position */
            position: number;
            /** Scan */
            scan: string;
            /** Scanned By */
            scanned_by: string;
            /**
             * Station
             * @default
             */
            station: string;
            /** Step */
            step: string;
        };
        /**
         * ScanRequest
         * @description Who scanned, at which station. A station device signs in as the
         *     shop's staff, so the person is named here, not inferred from the token.
         */
        ScanRequest: {
            /** Scanned By */
            scanned_by: string;
            /**
             * Station
             * @default
             */
            station: string;
        };
        /** ScanResult */
        ScanResult: {
            /** Batch Number */
            batch_number: number;
            next_expected?: components["schemas"]["RouteStep"] | null;
            /**
             * Scanned At
             * Format: date-time
             */
            scanned_at: string;
            /** Scanned By */
            scanned_by: string;
            /** Station */
            station: string;
            step: components["schemas"]["RouteStep"];
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** ScrapeWebsiteRequest */
        ScrapeWebsiteRequest: {
            /**
             * Url
             * Format: uri
             */
            url: string;
        };
        /** ScrapeWebsiteResponse */
        ScrapeWebsiteResponse: {
            /** Brand Colors */
            brand_colors?: string[];
            /** Company Name */
            company_name?: string | null;
            /** Description */
            description?: string | null;
            /** Industry */
            industry?: string | null;
            /** Location City */
            location_city?: string | null;
            /** Location Country */
            location_country?: string | null;
            /** Location State */
            location_state?: string | null;
            /** Logo Url */
            logo_url?: string | null;
        };
        /** SeedCatalogResponse */
        SeedCatalogResponse: {
            /** Seeded */
            seeded: number;
        };
        /**
         * SendMessageRequest
         * @description Request to send an outbound message.
         */
        SendMessageRequest: {
            /** Agent Task Id */
            agent_task_id?: string | null;
            /** Body */
            body: string;
            /** Channel */
            channel: string;
            /** Order Id */
            order_id?: string | null;
            /** Recipient Email */
            recipient_email?: string | null;
            /** Recipient Phone */
            recipient_phone?: string | null;
        };
        /**
         * SessionResponse
         * @description The wire answer of sign-in, registration, refresh and change-password
         *     (review 19 Nov 2026, item 6): the access token for memory only; the
         *     refresh token travels in an HttpOnly cookie, never in a body.
         */
        SessionResponse: {
            /** Access Token */
            access_token: string;
            /**
             * Expires In
             * @description Access token expiry in seconds
             */
            expires_in: number;
            /**
             * Token Type
             * @default bearer
             */
            token_type: string;
        };
        /**
         * SessionSummary
         * @description One live session of the caller (a refresh-token row): when it was
         *     opened and when it expires. Nothing that identifies the token.
         */
        SessionSummary: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Current
             * @default false
             */
            current: boolean;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /** SetCustomDomainRequest */
        SetCustomDomainRequest: {
            /** Custom Domain */
            custom_domain?: string | null;
        };
        /** SetExpirationRequest */
        SetExpirationRequest: {
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
        };
        /**
         * SetStockRequest
         * @description Request to set stock quantity to a specific value.
         */
        SetStockRequest: {
            /** Quantity */
            quantity: number;
            /** Reason */
            reason: string;
        };
        /**
         * ShadowHistoryUpload
         * @description A history.db the bridge uploaded (20 Nov 2026): what Teaky holds of it.
         *     Never the bytes; the download is its own read.
         */
        ShadowHistoryUpload: {
            /**
             * Bridge Token Id
             * Format: uuid
             */
            bridge_token_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
            /** Source Mtime */
            source_mtime?: string | null;
            /**
             * Stored
             * @default true
             */
            stored: boolean;
            /**
             * Uploaded At
             * Format: date-time
             */
            uploaded_at: string;
        };
        /** ShipmentResult */
        ShipmentResult: {
            /** Carrier */
            carrier: string;
            /** Label Url */
            label_url: string | null;
            /** Service */
            service: string;
            /** Tracking Number */
            tracking_number: string;
        };
        /** ShippingAddress */
        ShippingAddress: {
            /** Attention */
            attention?: string | null;
            /** City */
            city: string;
            /**
             * Country
             * @default US
             */
            country: string;
            /** Line1 */
            line1: string;
            /** Line2 */
            line2?: string | null;
            /** Name */
            name: string;
            /** Phone */
            phone?: string | null;
            /** Postal Code */
            postal_code: string;
            /** State */
            state: string;
        };
        /**
         * ShippingAddressInput
         * @description The ship-to as a buyer or staff member submits it (ruling 2 Nov 2026).
         *
         *     ``ShippingAddress`` is also the read shape of every stored order, so the
         *     rules live here, on the write side only: a row stored before the rule is
         *     still readable. Rules: every required field non-blank after stripping and
         *     within length; ``country`` is US today (the carrier account, the freight
         *     quote and the state and ZIP checks all assume it); ``state`` a two-letter
         *     code, upper-cased; ``postal_code`` five digits or ZIP+4; no PO Box on
         *     either line because every shipment is UPS. Refused with a field-named 422
         *     rather than reaching DocketManager's shipping location blank.
         */
        ShippingAddressInput: {
            /** Attention */
            attention?: string | null;
            /** City */
            city: string;
            /**
             * Country
             * @default US
             */
            country: string;
            /** Line1 */
            line1: string;
            /** Line2 */
            line2?: string | null;
            /** Name */
            name: string;
            /** Phone */
            phone?: string | null;
            /** Postal Code */
            postal_code: string;
            /** State */
            state: string;
        };
        /**
         * ShippingCsvConfig
         * @description The ALLORDER shipping CSV's shop-side values (dispatch 11 Nov 2026,
         *     B). Off by default. When on, a push-out's bundle carries one CSV with
         *     Andrew's header exactly and one row per shipment; the UPS account, the
         *     billing option and the service come from here, as does every other
         *     column that is the shipper's rather than the shipment's. Nothing is
         *     invented: a blank here is a blank in the file, and the three the carrier
         *     needs (account, billing option, service) refuse the build when blank.
         */
        ShippingCsvConfig: {
            /**
             * Billing Option
             * @default
             */
            billing_option: string;
            /**
             * Enabled
             * @default false
             */
            enabled: boolean;
            /**
             * Fixed Columns
             * @default {}
             */
            fixed_columns: {
                [key: string]: string;
            };
            /**
             * Product Description
             * @default
             */
            product_description: string;
            /**
             * Residential
             * @default
             */
            residential: string;
            /**
             * Service Type
             * @default
             */
            service_type: string;
            /**
             * Ship Notification Type
             * @default
             */
            ship_notification_type: string;
            /**
             * Ups Account
             * @default
             */
            ups_account: string;
        };
        /** ShippingRateResponse */
        ShippingRateResponse: {
            /** Carrier */
            carrier: string;
            /** Cost */
            cost: string;
            /** Currency */
            currency: string;
            /** Estimated Days */
            estimated_days?: number | null;
            /** Rate Id */
            rate_id: string;
            /** Service */
            service: string;
        };
        /**
         * ShopVOXConfigSchema
         * @description Config for shopVOX REST integration.
         */
        ShopVOXConfigSchema: {
            /** Api Key */
            api_key: string;
            /** Api Url */
            api_url: string;
            /** App Id */
            app_id: string;
            /**
             * Auto Push On Approval
             * @default true
             */
            auto_push_on_approval: boolean;
        };
        /**
         * SignupAvailability
         * @description GET /auth/signup (t04, 18 Nov 2026): whether public self-signup is on,
         *     so the root page shows or hides "Create a free account". The backend
         *     refuses POST /auth/register on its own when it is off.
         */
        SignupAvailability: {
            /** Public Signup Enabled */
            public_signup_enabled: boolean;
        };
        /**
         * SizeFraction
         * @description Single size's fraction of a product's quantity distribution.
         */
        SizeFraction: {
            /** Fraction */
            fraction: number;
            /** Size Label */
            size_label: string;
        };
        /** SizeOption */
        "SizeOption-Input": {
            /** Label */
            label: string;
            /**
             * Price Adjustment
             * @default 0.00
             */
            price_adjustment: number | string;
        };
        /** SizeOption */
        "SizeOption-Output": {
            /** Label */
            label: string;
            /**
             * Price Adjustment
             * @default 0
             */
            price_adjustment: number;
        };
        /**
         * SizeQuantity
         * @description Labeled size quantity (e.g., garment size → integer count).
         */
        SizeQuantity: {
            /** Quantity */
            quantity: number;
            /** Size Label */
            size_label: string;
        };
        /**
         * SpecAssertion
         * @description A row of the spec library (spine 2 Part A, bead 1bs2): a product's
         *     attribute value with its provenance and the evidence rows shown at the
         *     time. Never deleted; a correction supersedes.
         */
        SpecAssertion: {
            /**
             * Asserted At
             * Format: date-time
             */
            asserted_at: string;
            /** Asserted By Id */
            asserted_by_id?: string | null;
            /**
             * Attribute
             * @default stock
             */
            attribute: string;
            /** Evidence */
            evidence?: components["schemas"]["StockEvidence"][];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Product Key */
            product_key: string;
            source: components["schemas"]["SpecSource"];
            /** Superseded By */
            superseded_by?: string | null;
            /** Value */
            value: string;
        };
        /**
         * SpecAssertRequest
         * @description "Correct the stock": the value and, optionally, why.
         */
        SpecAssertRequest: {
            /**
             * Note
             * @default
             */
            note: string;
            /** Value */
            value: string;
        };
        /**
         * SpecHistoryEntry
         * @description A history row with the person's name resolved (nothing is deleted; a
         *     correction supersedes).
         */
        SpecHistoryEntry: {
            /**
             * Asserted At
             * Format: date-time
             */
            asserted_at: string;
            /** Asserted By */
            asserted_by?: string | null;
            /** Asserted By Id */
            asserted_by_id?: string | null;
            /**
             * Attribute
             * @default stock
             */
            attribute: string;
            /** Evidence */
            evidence?: components["schemas"]["StockEvidence"][];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /** Product Key */
            product_key: string;
            source: components["schemas"]["SpecSource"];
            /** Superseded By */
            superseded_by?: string | null;
            /** Value */
            value: string;
        };
        /**
         * SpecialtyProductionSpec
         * @description Specialty production equipment — dtg, screen_print, embroidery,
         *     sublimation, pad_print, heat_press, vinyl_cut, laser_engraver.
         *
         *     Most attributes of specialty production machines live on typed
         *     columns (``print_area_width``, ``print_area_height``, ``max_colors``)
         *     or do not appear in seed JSONB today. Only ``transfer_types``
         *     surfaces here, from the Single Source heat press record. Bead 3
         *     enrichment can extend this schema when richer data lands.
         */
        SpecialtyProductionSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Transfer Types */
            transfer_types?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /**
         * SpecImportAction
         * @description What the spec import did, or would do, with one row (ruling 11 Nov
         *     2026): written as source=import; skipped because a row is already in
         *     force for the key (an import never overrides); skipped for carrying no
         *     stock and no not-batched signal.
         * @enum {string}
         */
        SpecImportAction: "write" | "skip_asserted" | "skip_no_value";
        /** SpecImportDecision */
        SpecImportDecision: {
            action: components["schemas"]["SpecImportAction"];
            /** Attribute */
            attribute: string;
            /** Product Key */
            product_key: string;
            /** Reason */
            reason: string;
            /** Value */
            value: string;
        };
        /** SpecImportRequest */
        SpecImportRequest: {
            /**
             * Dry Run
             * @default true
             */
            dry_run: boolean;
            /** Rows */
            rows: components["schemas"]["SpecImportRow"][];
        };
        /** SpecImportResult */
        SpecImportResult: {
            /** Decisions */
            decisions: components["schemas"]["SpecImportDecision"][];
            /** Dry Run */
            dry_run: boolean;
            /** Skipped Asserted */
            skipped_asserted: number;
            /** Skipped No Value */
            skipped_no_value: number;
            /** Written */
            written: number;
        };
        /**
         * SpecImportRow
         * @description One product as his Stock window / history.db has it: the stock string
         *     as given (an unknown stock is a string, improvement 13), his category,
         *     whether he excluded it, and the evidence the file showed.
         */
        SpecImportRow: {
            /**
             * Category
             * @default
             */
            category: string;
            /** Evidence */
            evidence?: components["schemas"]["StockEvidence"][];
            /**
             * Excluded
             * @default false
             */
            excluded: boolean;
            /** Product Key */
            product_key: string;
            /**
             * Stock
             * @default
             */
            stock: string;
        };
        /**
         * SpecLibraryRow
         * @description One product of the shop's spec library as the Products screen shows
         *     it (day 3, board 5): the value in force with its provenance, whether the
         *     history agrees, and how used the product is.
         */
        SpecLibraryRow: {
            /** Agrees */
            agrees?: boolean | null;
            /**
             * Asserted At
             * Format: date-time
             */
            asserted_at: string;
            /** Asserted By */
            asserted_by?: string | null;
            /** Asserted By Id */
            asserted_by_id?: string | null;
            /** Evidence */
            evidence?: components["schemas"]["StockEvidence"][];
            /**
             * Not Batched
             * @default false
             */
            not_batched: boolean;
            /**
             * Prior Units
             * @default 0
             */
            prior_units: number;
            /** Product Key */
            product_key: string;
            /**
             * Product Name
             * @default
             */
            product_name: string;
            source: components["schemas"]["SpecSource"];
            /** Value */
            value: string;
        };
        /** SpecNotBatchedRequest */
        SpecNotBatchedRequest: {
            /**
             * Note
             * @default
             */
            note: string;
        };
        /**
         * SpecSource
         * @description Where a spec assertion came from (spine 2 Part A). Stored as a string;
         *     a docket row is a proposal — shown, never applied without a person.
         * @enum {string}
         */
        SpecSource: "person" | "import" | "history" | "docket" | "channel";
        /**
         * SpecSuggestion
         * @description What the staff view shows for a stock_unknown hold: the library row in
         *     force (first), the docket proposals (shown, never applied), the history
         *     suggestions with their evidence, and whether library and history agree.
         */
        SpecSuggestion: {
            /** Agrees */
            agrees?: boolean | null;
            /** History */
            history?: components["schemas"]["StockSuggestion"][];
            /**
             * Leading Source
             * @default none
             */
            leading_source: string;
            /** Leading Value */
            leading_value?: string | null;
            library?: components["schemas"]["SpecAssertion"] | null;
            /** Product Key */
            product_key: string;
            /** Proposals */
            proposals?: components["schemas"]["SpecAssertion"][];
        };
        /**
         * SpeedSqFtPerHour
         * @description Throughput in square-feet-per-hour, optionally qualified by mode.
         *
         *     Consolidates the four sibling keys used in seed data
         *     (``speed_sq_ft_per_hour``, ``..._draft``, ``..._quality``,
         *     ``..._production``). ``typical`` holds the value when only a single
         *     scalar was recorded. ``draft``/``quality``/``production`` hold the
         *     per-mode values where the manufacturer quoted them separately. All
         *     fields are individually optional, but at least one must be set —
         *     an empty object carries no information.
         */
        SpeedSqFtPerHour: {
            /** Draft */
            draft?: number | null;
            /** Production */
            production?: number | null;
            /** Quality */
            quality?: number | null;
            /** Typical */
            typical?: number | null;
        };
        /** StationHoldResult */
        StationHoldResult: {
            /** Batch Number */
            batch_number: number;
            /** Detail */
            detail: string;
            /**
             * Hold Id
             * Format: uuid
             */
            hold_id: string;
            /** Opened By */
            opened_by: string;
            step?: components["schemas"]["RouteStep"] | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * StationScan
         * @description One line of "last scans" at a station, from the audit rows the scan
         *     endpoints write (accepted, refused, hold).
         */
        StationScan: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /** Batch Number */
            batch_number?: number | null;
            /**
             * Detail
             * @default
             */
            detail: string;
            /** Position */
            position?: number | null;
            /** Scan */
            scan: string;
            /**
             * Scanned By
             * @default
             */
            scanned_by: string;
            /**
             * Station
             * @default
             */
            station: string;
            /** Step */
            step?: string | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * StationView
         * @description What the station card shows for one scanned batch (day 5, 7 Nov 2026,
         *     Part B — canvas board 3): the route step by step, the step the next scan
         *     is expected at and which scan (arrived or done), whether the batch is
         *     held.
         */
        StationView: {
            /** Batch Number */
            batch_number: number;
            /** Docket Number */
            docket_number?: string | null;
            expected?: components["schemas"]["RouteStep"] | null;
            /** Expected Scan */
            expected_scan?: string | null;
            /**
             * Held
             * @default false
             */
            held: boolean;
            /** Steps */
            steps?: components["schemas"]["RouteStep"][];
            /** Stock */
            stock?: string | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * StockedGoodsFile
         * @description The unit's shipping CSV as written: name, size, checksum, when.
         */
        StockedGoodsFile: {
            /**
             * File Id
             * Format: uuid
             */
            file_id: string;
            /** Filename */
            filename: string;
            /**
             * Generated At
             * Format: date-time
             */
            generated_at: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
        };
        /** StockedGoodsLine */
        StockedGoodsLine: {
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /** Pack Size */
            pack_size: number;
            /** Product */
            product: string;
            /**
             * Product Name
             * @default
             */
            product_name: string;
            /** Quantity */
            quantity: number;
        };
        /** StockedGoodsUnit */
        StockedGoodsUnit: {
            /** Age Seconds */
            age_seconds: number;
            /**
             * Customer
             * @default
             */
            customer: string;
            /** Lines */
            lines?: components["schemas"]["StockedGoodsLine"][];
            /**
             * Mixed Po
             * @default false
             */
            mixed_po: boolean;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Order Number */
            order_number?: string | null;
            /** Picked At */
            picked_at?: string | null;
            /** Picked By Id */
            picked_by_id?: string | null;
            /** Po */
            po: string;
            /**
             * Received At
             * Format: date-time
             */
            received_at: string;
            shipping_csv?: components["schemas"]["StockedGoodsFile"] | null;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** StockEvidence */
        StockEvidence: {
            /** Detail */
            detail: string;
            kind: components["schemas"]["StockEvidenceKind"];
            /** Stock */
            stock: string;
        };
        /**
         * StockEvidenceKind
         * @description Where a stock suggestion's evidence comes from (spine 1, improvement 5).
         * @enum {string}
         */
        StockEvidenceKind: "prior_units" | "customer_products" | "description_tokens" | "person_note" | "import";
        /**
         * StockStatus
         * @description Current stock status for a variant.
         */
        StockStatus: {
            /**
             * Auto Reorder Enabled
             * @default false
             */
            auto_reorder_enabled: boolean;
            /** Color */
            color?: string | null;
            /**
             * Is Low
             * @default false
             */
            is_low: boolean;
            /**
             * Is Out
             * @default false
             */
            is_out: boolean;
            /**
             * Low Stock Threshold
             * @default 20
             */
            low_stock_threshold: number;
            /**
             * Product Id
             * Format: uuid
             */
            product_id: string;
            /** Size */
            size?: string | null;
            /** Sku */
            sku?: string | null;
            /** Stock Quantity */
            stock_quantity?: number | null;
            /** Track Inventory */
            track_inventory: boolean;
            /**
             * Variant Id
             * Format: uuid
             */
            variant_id: string;
        };
        /** StockSuggestion */
        StockSuggestion: {
            /** Evidence */
            evidence?: components["schemas"]["StockEvidence"][];
            /** Stock */
            stock: string;
        };
        /**
         * StoreCreationRequest
         * @description Request body for creating a store from a natural language description.
         */
        StoreCreationRequest: {
            /** @description Pre-scraped brand data to avoid re-scanning */
            brand_data?: components["schemas"]["BrandData"] | null;
            /** Description */
            description: string;
        };
        /**
         * StoreCreationResult
         * @description Result of the multi-agent store creation flow.
         */
        StoreCreationResult: {
            /** Agent Summary */
            agent_summary: string;
            brand_assets_found?: components["schemas"]["BrandAssetsFound"];
            /** Capability Gaps */
            capability_gaps?: string[];
            /** Categories Created */
            categories_created?: string[];
            /** Playbook Applied */
            playbook_applied?: string | null;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Portal Name */
            portal_name: string;
            /** Portal Url */
            portal_url: string;
            /** Product Resolutions */
            product_resolutions?: components["schemas"]["ProductResolutionDetail"][];
            /** Products Created */
            products_created: number;
            /** Warnings */
            warnings?: string[];
        };
        /** StripeStatusResponse */
        StripeStatusResponse: {
            /** Account Id */
            account_id: string | null;
            /** Charges Enabled */
            charges_enabled: boolean;
            /** Connected */
            connected: boolean;
        };
        /**
         * SubmitFeedbackRequest
         * @description Explicit feedback submitted by a user.
         */
        SubmitFeedbackRequest: {
            /** Agent Id */
            agent_id: string;
            /** Agent Task Id */
            agent_task_id?: string | null;
            /** Category */
            category?: string | null;
            /** Corrected Output */
            corrected_output?: {
                [key: string]: unknown;
            } | null;
            /** Feedback Type */
            feedback_type: string;
            /** Notes */
            notes?: string | null;
            /** Original Output */
            original_output?: {
                [key: string]: unknown;
            } | null;
        };
        /** SubmitProofRequest */
        SubmitProofRequest: {
            /** File Url */
            file_url: string;
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /** Specs */
            specs?: {
                [key: string]: unknown;
            } | null;
            /** Thumbnail Url */
            thumbnail_url?: string | null;
        };
        /**
         * SuggestedPrice
         * @description Suggested retail pricing tiers from the master catalog.
         */
        SuggestedPrice: {
            /** Base Cost */
            base_cost: number;
            /** Max Qty */
            max_qty?: number | null;
            /**
             * Min Qty
             * @default 1
             */
            min_qty: number;
            /** Suggested Retail */
            suggested_retail: number;
        };
        /** SummaryMetrics */
        SummaryMetrics: {
            /** Active Portal Count */
            active_portal_count: number;
            /** Average Order Value */
            average_order_value: number;
            /**
             * Held Order Count
             * @default 0
             */
            held_order_count: number;
            /** Order Count */
            order_count: number;
            /** Orders By Status */
            orders_by_status: components["schemas"]["OrderStatusBreakdown"][];
            /** Pending Proof Count */
            pending_proof_count: number;
            /**
             * Ready To Release Count
             * @default 0
             */
            ready_to_release_count: number;
            /** Total Revenue */
            total_revenue: number;
        };
        /**
         * SvgQualityDetails
         * @description Quality-check details for SVG vector assets (Pattern 3b variant).
         */
        SvgQualityDetails: {
            /** Error */
            error?: string | null;
            /** Format */
            format: string;
            /** Has Viewbox */
            has_viewbox?: boolean | null;
            /** Height */
            height?: string | null;
            /** Is Valid Svg */
            is_valid_svg?: boolean | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "svg";
            /** Root Tag */
            root_tag?: string | null;
            /** Width */
            width?: string | null;
        };
        /**
         * TagRules
         * @description The customer → tags rules, read and written whole (PUT replaces the
         *     list; an empty list clears it). Every other ``press_run_config`` key is
         *     untouched by a write.
         */
        TagRules: {
            /** Customer Tags */
            customer_tags?: components["schemas"]["CustomerTagRule"][];
        };
        /**
         * TakeoverAgentTaskRequest
         * @description Request for a human to take over an agent task.
         */
        TakeoverAgentTaskRequest: {
            /** Notes */
            notes?: string | null;
        };
        /**
         * TaylorSessionRelay
         * @description The cookies PortalClient.cs saved, by name. Never logged, never
         *     echoed; the response carries the count only.
         */
        TaylorSessionRelay: {
            /** Cookies */
            cookies: {
                [key: string]: string;
            };
        };
        /** TaylorSessionRelayResult */
        TaylorSessionRelayResult: {
            /** Cookie Count */
            cookie_count: number;
            /**
             * Organization Id
             * Format: uuid
             */
            organization_id: string;
            /**
             * Stored At
             * Format: date-time
             */
            stored_at: string;
        };
        /**
         * ExportFormat
         * @enum {string}
         */
        teaky_print_portal__models__schemas__analytics__ExportFormat: "csv" | "xlsx" | "pdf";
        /**
         * ImportResult
         * @description Final import execution result.
         */
        teaky_print_portal__models__schemas__data_import__ImportResult: {
            /**
             * Created Count
             * @default 0
             */
            created_count: number;
            /**
             * Error Count
             * @default 0
             */
            error_count: number;
            /** Errors */
            errors?: components["schemas"]["ValidationError"][];
            /** Notices */
            notices?: string[];
            /**
             * Skipped Count
             * @default 0
             */
            skipped_count: number;
        };
        /**
         * ExportFormat
         * @description Supported design export formats.
         * @enum {string}
         */
        teaky_print_portal__models__schemas__design__ExportFormat: "svg" | "pdf";
        /** ImportResult */
        teaky_print_portal__models__schemas__product__ImportResult: {
            /** Created */
            created: number;
            /** Errors */
            errors: string[];
            /** Skipped */
            skipped: number;
        };
        /** TeamMember */
        TeamMember: {
            /**
             * Assigned At
             * Format: date-time
             */
            assigned_at: string;
            /** Display Name */
            display_name?: string | null;
            /** Email */
            email: string;
            /** Portal Assignments */
            portal_assignments?: components["schemas"]["PortalAssignment"][];
            /** Reports To */
            reports_to?: string | null;
            /** Roles */
            roles?: string[];
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** TeamPerformanceResponse */
        TeamPerformanceResponse: {
            /** Reps */
            reps: components["schemas"]["RepPerformance"][];
            /** Team Total Orders */
            team_total_orders: number;
            /** Team Total Revenue */
            team_total_revenue: number;
        };
        /** TestConnectionResponse */
        TestConnectionResponse: {
            /** Connected */
            connected: boolean;
            details?: components["schemas"]["MISAdapterStatus"] | null;
        };
        /**
         * TextElement
         * @description A text element in a design specification.
         */
        TextElement: {
            /**
             * Color
             * @default #000000
             */
            color: string;
            /** Content */
            content: string;
            /**
             * Font Size
             * @default 24
             */
            font_size: number;
            /**
             * Font Weight
             * @default normal
             */
            font_weight: string;
            /**
             * Position
             * @default center
             */
            position: string;
        };
        /**
         * TimeGranularity
         * @enum {string}
         */
        TimeGranularity: "daily" | "weekly" | "monthly";
        /**
         * ToneSetting
         * @description Agent tone settings configurable per organization.
         * @enum {string}
         */
        ToneSetting: "professional_only" | "friendly_professional" | "casual";
        /** TopProduct */
        TopProduct: {
            /** Product Id */
            product_id: string;
            /** Product Name */
            product_name: string;
            /** Product Sku */
            product_sku: string | null;
            /** Total Quantity */
            total_quantity: number;
            /** Total Revenue */
            total_revenue: number;
        };
        /** TopProductsResponse */
        TopProductsResponse: {
            /** By Quantity */
            by_quantity: components["schemas"]["TopProduct"][];
            /** By Revenue */
            by_revenue: components["schemas"]["TopProduct"][];
        };
        /** TrackingEvent */
        TrackingEvent: {
            /** City */
            city: string | null;
            /** Datetime */
            datetime: string | null;
            /** Message */
            message: string | null;
            /** State */
            state: string | null;
            /** Status */
            status: string;
        };
        /** TrackingResponse */
        TrackingResponse: {
            /** Estimated Delivery */
            estimated_delivery?: string | null;
            /** Events */
            events: components["schemas"]["TrackingEvent"][];
            /** Status */
            status: string;
            /** Tracking Number */
            tracking_number: string;
        };
        /**
         * UnitLocation
         * @description Where a production unit stands on its route: the step it is at or out
         *     to, else the next pending step, else nothing (no route, or finished).
         */
        UnitLocation: {
            /** Position */
            position?: number | null;
            /** Since */
            since?: string | null;
            /** @default none */
            state: components["schemas"]["UnitLocationState"];
            /**
             * Step
             * @default
             */
            step: string;
        };
        /**
         * UnitLocationState
         * @description Where a production unit stands on its route (whereabouts, item 2 of
         *     17–18 Nov 2026; typed 19 Nov): at a station step, out at a vendor step,
         *     next (the first pending step), done, or none (no route defined).
         * @enum {string}
         */
        UnitLocationState: "at" | "out" | "next" | "done" | "none";
        /** UnreadCountResponse */
        UnreadCountResponse: {
            /** Count */
            count: number;
        };
        /**
         * UnsupportedFormatDetails
         * @description Quality-check details for asset formats that don't support quality checks.
         */
        UnsupportedFormatDetails: {
            /** Format */
            format: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "unsupported";
            /** Note */
            note: string;
        };
        /** UpdateAdminSettingsRequest */
        UpdateAdminSettingsRequest: {
            /** Require Second Approver Admin */
            require_second_approver_admin: boolean;
            /** Require Second Approver Floor */
            require_second_approver_floor: boolean;
        };
        /**
         * UpdateAgentConfigRequest
         * @description Partial update for agent configuration.
         */
        UpdateAgentConfigRequest: {
            /** Allowed Topics */
            allowed_topics?: string[] | null;
            /** Auto Pass Enabled */
            auto_pass_enabled?: boolean | null;
            /** Byok Anthropic Key Ref */
            byok_anthropic_key_ref?: string | null;
            /** Byok Openai Key Ref */
            byok_openai_key_ref?: string | null;
            /** Copyright Screening Enabled */
            copyright_screening_enabled?: boolean | null;
            /** Escalation Confidence Threshold */
            escalation_confidence_threshold?: number | null;
            /** Incident Alert Level */
            incident_alert_level?: string | null;
            /** Profanity Handling */
            profanity_handling?: string | null;
            qa_mode?: components["schemas"]["QAMode"] | null;
            tone_setting?: components["schemas"]["ToneSetting"] | null;
        };
        /**
         * UpdateAgentTaskRequest
         * @description Request to update an agent task.
         */
        UpdateAgentTaskRequest: {
            /** Assigned To */
            assigned_to?: string | null;
            /** Confidence Score */
            confidence_score?: number | null;
            /** Error Message */
            error_message?: string | null;
            /** Escalation Reason */
            escalation_reason?: string | null;
            state?: components["schemas"]["AgentTaskState"] | null;
            /** Status */
            status?: string | null;
        };
        /** UpdateCartItemRequest */
        UpdateCartItemRequest: {
            /** Artwork Change Note */
            artwork_change_note?: string | null;
            artwork_disposition?: components["schemas"]["ArtworkDisposition"] | null;
            /** Artwork Upload Url */
            artwork_upload_url?: string | null;
            /** Quantity */
            quantity: number;
            /** Recipients */
            recipients?: components["schemas"]["RecipientInput"][] | null;
        };
        /** UpdateCategoryRequest */
        UpdateCategoryRequest: {
            /** Description */
            description?: string | null;
            /** Name */
            name?: string | null;
            /** Parent Id */
            parent_id?: string | null;
            /** Slug */
            slug?: string | null;
            /** Sort Order */
            sort_order?: number | null;
        };
        /**
         * UpdateCompanyProfileRequest
         * @description All fields optional for partial updates. Use model_dump(exclude_unset=True).
         */
        UpdateCompanyProfileRequest: {
            /** Address Line1 */
            address_line1?: string | null;
            /** Address Line2 */
            address_line2?: string | null;
            brand_colors?: components["schemas"]["BrandColors"] | null;
            /** Description */
            description?: string | null;
            /** Industry */
            industry?: string | null;
            /** Is Wizard Complete */
            is_wizard_complete?: boolean | null;
            /** Location City */
            location_city?: string | null;
            /** Location Country */
            location_country?: string | null;
            /** Location State */
            location_state?: string | null;
            /** Logo Url */
            logo_url?: string | null;
            /** Phone */
            phone?: string | null;
            /** Postal Code */
            postal_code?: string | null;
            /** Website Url */
            website_url?: string | null;
        };
        /**
         * UpdateFundraiserRequest
         * @description Request to update fundraiser settings.
         */
        UpdateFundraiserRequest: {
            /** Allow Donations */
            allow_donations?: boolean | null;
            /** Cause Amount Per Item */
            cause_amount_per_item?: number | string | null;
            /** Cause Description */
            cause_description?: string | null;
            /** End Date */
            end_date?: string | null;
            /** Goal Amount */
            goal_amount?: number | string | null;
            /** Organizer Name */
            organizer_name?: string | null;
        };
        /**
         * UpdateLineItemCostsRequest
         * @description Staff edit of the manual line-level inputs. Omitted fields are untouched.
         */
        UpdateLineItemCostsRequest: {
            /** Cost Source */
            cost_source?: string | null;
            /** Decoration Charge */
            decoration_charge?: number | string | null;
            /** Inbound Freight Allocation */
            inbound_freight_allocation?: number | string | null;
            /** Unit Cost */
            unit_cost?: number | string | null;
        };
        /** UpdateMISSettingsRequest */
        UpdateMISSettingsRequest: {
            /** Mis Config */
            mis_config?: components["schemas"]["DMConfigSchema-Input"] | components["schemas"]["PrintavoConfigSchema"] | components["schemas"]["ShopVOXConfigSchema"] | components["schemas"]["GenericCSVConfigSchema"] | components["schemas"]["GenericWebhookConfigSchema"] | null;
            /** Mis Provider */
            mis_provider?: string | null;
        };
        /** UpdateNotificationPreferencesRequest */
        UpdateNotificationPreferencesRequest: {
            /** Preferences */
            preferences: components["schemas"]["NotificationPreference"][];
        };
        /**
         * UpdateOrderCostsRequest
         * @description Staff edit of the manual order-level inputs. Omitted fields are untouched.
         */
        UpdateOrderCostsRequest: {
            /** Invoice Month */
            invoice_month?: string | null;
            /** Outbound Freight Cost */
            outbound_freight_cost?: number | string | null;
            /** Processing Fee Actual */
            processing_fee_actual?: number | string | null;
            /** Processing Fee Source */
            processing_fee_source?: string | null;
        };
        /** UpdateOrderRequest */
        UpdateOrderRequest: {
            /** Notes */
            notes?: string | null;
            /** Rgi Order Number */
            rgi_order_number?: string | null;
            /** Tags */
            tags?: string[] | null;
            /** Tracking Number */
            tracking_number?: string | null;
        };
        /** UpdateOrderStatusRequest */
        UpdateOrderStatusRequest: {
            /** Status */
            status: string;
        };
        /**
         * UpdateOrganizationRequest
         * @description PATCH /organizations/me (t06, 19 Nov 2026): the organisation's display
         *     name — the one the shell, the emails and the invitations carry. Until this
         *     route the name was SQL (the sandbox shop was renamed through the bastion
         *     on 19 Nov 2026). Whitespace is trimmed; an empty name is refused.
         */
        UpdateOrganizationRequest: {
            /** Name */
            name: string;
        };
        /**
         * UpdatePlaybookRequest
         * @description Request to update a playbook template.
         */
        UpdatePlaybookRequest: {
            budget_guidance?: components["schemas"]["PlaybookBudgetGuidance"] | null;
            /** Category */
            category?: string | null;
            /** Description */
            description?: string | null;
            design_theme?: components["schemas"]["PlaybookDesignTheme"] | null;
            /** Is Active */
            is_active?: boolean | null;
            /** Name */
            name?: string | null;
            /** Pro Tips */
            pro_tips?: string[] | null;
            /** Products */
            products?: components["schemas"]["PlaybookProductSpec"][] | null;
            /** Timeline */
            timeline?: components["schemas"]["PlaybookTimelineStep"][] | null;
        };
        /** UpdatePortalRequest */
        UpdatePortalRequest: {
            /** Approval Workflow */
            approval_workflow?: string | null;
            brand_config?: components["schemas"]["BrandConfig"] | null;
            /** Custom Domain */
            custom_domain?: string | null;
            customer_classification?: components["schemas"]["CustomerClassification"] | null;
            /** Name */
            name?: string | null;
            /** Require Po */
            require_po?: boolean | null;
            /** Revenue Share Rate */
            revenue_share_rate?: number | string | null;
            /** Self Registration */
            self_registration?: boolean | null;
            /** Slug */
            slug?: string | null;
        };
        /**
         * UpdateProductionSettingsRequest
         * @description PUT body: the whole resource. Every other key of ``press_run_config``
         *     (channels, item codes, press geometry) is preserved untouched.
         */
        UpdateProductionSettingsRequest: {
            /**
             * Auto Push When Full
             * @default false
             */
            auto_push_when_full: boolean;
            /**
             * Bridge Bundles Enabled
             * @default false
             */
            bridge_bundles_enabled: boolean;
            /** Gang Whole Orders */
            gang_whole_orders: boolean;
            /** Hold Age Days */
            hold_age_days: number;
            /** @default cards */
            production_view: components["schemas"]["ProductionView"];
            /** Shop Name */
            shop_name: string;
            /** Split When Unplaceable */
            split_when_unplaceable: boolean;
            /** Timezone */
            timezone: string;
        };
        /**
         * UpdateProductRequest
         * @description A partial update; only sent keys change. Unknown keys are rejected (422), never dropped.
         */
        UpdateProductRequest: {
            /** Base Cost */
            base_cost?: number | string | null;
            /** Base Price */
            base_price?: number | string | null;
            /** Category */
            category?: string | null;
            /** Category Id */
            category_id?: string | null;
            /** Collects Recipients */
            collects_recipients?: boolean | null;
            /** Colors */
            colors?: components["schemas"]["ColorOption"][] | null;
            /** Cost Source */
            cost_source?: string | null;
            /** Cost Source Url */
            cost_source_url?: string | null;
            /** Description */
            description?: string | null;
            /** Dm External Id */
            dm_external_id?: string | null;
            /** Floor Multiplier */
            floor_multiplier?: number | string | null;
            lead_time_band?: components["schemas"]["LeadTimeBand"] | null;
            /** Margin Percent */
            margin_percent?: number | string | null;
            /** Markup Multiplier */
            markup_multiplier?: number | string | null;
            /** Max Order Quantity */
            max_order_quantity?: number | null;
            /** Min Order Qty */
            min_order_qty?: number | null;
            /** Mockup Urls */
            mockup_urls?: string[] | null;
            /** Name */
            name?: string | null;
            /** Option Set Name */
            option_set_name?: string | null;
            /** Outsourced */
            outsourced?: boolean | null;
            /** Pack Size */
            pack_size?: number | null;
            /** Previous Dm Order Number */
            previous_dm_order_number?: string | null;
            /** Price Locked */
            price_locked?: boolean | null;
            /** Price Options */
            price_options?: components["schemas"]["PriceOptionInput"][] | null;
            /** Pricing Tiers */
            pricing_tiers?: components["schemas"]["PricingTier-Input"][] | null;
            /** Proof Required */
            proof_required?: boolean | null;
            /** Safe Order Eligible */
            safe_order_eligible?: boolean | null;
            /** Sizes */
            sizes?: components["schemas"]["SizeOption-Input"][] | null;
            /** Sku */
            sku?: string | null;
            /** Sort Order */
            sort_order?: number | null;
            /** Status */
            status?: string | null;
        };
        /** UpdateQueueMappingsRequest */
        UpdateQueueMappingsRequest: {
            /** Queue Mapping */
            queue_mapping: components["schemas"]["QueueMappingEntry"][];
        };
        /** UpdateQuoteRequest */
        UpdateQuoteRequest: {
            /** Assigned To Id */
            assigned_to_id?: string | null;
            /** Notes */
            notes?: string | null;
            /** Quoted Price */
            quoted_price?: number | string | null;
            /** Status */
            status?: string | null;
        };
        /** UpdateTeamMemberRequest */
        UpdateTeamMemberRequest: {
            /** Display Name */
            display_name?: string | null;
            /** Portal Ids */
            portal_ids?: string[] | null;
            /** Reports To */
            reports_to?: string | null;
            /** Role */
            role?: string | null;
        };
        /** UpdateVariantRequest */
        UpdateVariantRequest: {
            /** Auto Reorder Enabled */
            auto_reorder_enabled?: boolean | null;
            /** Auto Reorder Quantity */
            auto_reorder_quantity?: number | null;
            /** Color */
            color?: string | null;
            /** Is Active */
            is_active?: boolean | null;
            /** Low Stock Threshold */
            low_stock_threshold?: number | null;
            /** Price Override */
            price_override?: number | string | null;
            /** Size */
            size?: string | null;
            /** Sku */
            sku?: string | null;
            /** Stock Quantity */
            stock_quantity?: number | null;
            /** Track Inventory */
            track_inventory?: boolean | null;
        };
        /** UploadResponse */
        UploadResponse: {
            /** Content Type */
            content_type: string;
            /** Filename */
            filename: string;
            /** Url */
            url: string;
        };
        /**
         * UVCoatingSpec
         * @description Stub — enum ``uv_coating``. No populated records in seed data
         *     today. Inherits only the universal base fields. Expand when
         *     enrichment populates real spec data.
         */
        UVCoatingSpec: {
            /** Limitations */
            limitations?: string[];
            /** Notes */
            notes?: string | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /** ValidationError */
        ValidationError: {
            /** Context */
            ctx?: Record<string, never>;
            /** Input */
            input?: unknown;
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /**
         * ValidationResult
         * @description Result of column mapping validation.
         */
        ValidationResult: {
            /** Errors */
            errors?: components["schemas"]["ValidationError"][];
            /** Mapped Preview */
            mapped_preview?: {
                [key: string]: unknown;
            }[];
            /**
             * Total Rows
             * @default 0
             */
            total_rows: number;
            /** Valid */
            valid: boolean;
        };
        /**
         * VariableDatum
         * @description One key/value of a line's variable data as the source sent it (H v3
         *     §2.7): ``value`` is the text (an empty string is an empty labelled slot,
         *     kept) or null when the value is the file named by ``file_id``.
         */
        VariableDatum: {
            /** File Id */
            file_id?: string | null;
            /** Key */
            key: string;
            /**
             * Position
             * @default 0
             */
            position: number;
            /** Value */
            value?: string | null;
        };
        /**
         * VariableDatumInput
         * @description A variable-data slot as a person enters it on an on-behalf line (Part B,
         *     5 Nov 2026): the same row shape the Taylor channel writes — key, text
         *     value (an empty string is an empty labelled slot), position.
         */
        VariableDatumInput: {
            /** Key */
            key: string;
            /**
             * Position
             * @default 0
             */
            position: number;
            /** Value */
            value?: string | null;
        };
        /**
         * VariantStockInfo
         * @description Stock availability for a product variant on the storefront.
         */
        VariantStockInfo: {
            /**
             * Availability
             * @default available
             */
            availability: string;
            /** Color */
            color?: string | null;
            /** Quantity Remaining */
            quantity_remaining?: number | null;
            /** Size */
            size?: string | null;
            /**
             * Variant Id
             * Format: uuid
             */
            variant_id: string;
        };
        /**
         * VaultHealthResponse
         * @description Response schema for vault health summary.
         */
        VaultHealthResponse: {
            /** By Type */
            by_type: {
                [key: string]: number;
            };
            /** Needs Attention */
            needs_attention: number;
            /** Pending */
            pending: number;
            /**
             * Portal Id
             * Format: uuid
             */
            portal_id: string;
            /** Preview Only */
            preview_only: number;
            /** Production Ready */
            production_ready: number;
            /** Total Assets */
            total_assets: number;
        };
        /**
         * VectorFileInfo
         * @description File info for vector PDF preflight (produced by
         *     preflight_checker.py:715).
         */
        VectorFileInfo: {
            /** Is Pdf */
            is_pdf: boolean;
            /** Page Count */
            page_count: number;
        };
        /** VoidedBatch */
        VoidedBatch: {
            /** Batch Number */
            batch_number: number;
            /**
             * Lines Left
             * @default 0
             */
            lines_left: number;
            /**
             * Pushed Out
             * @default false
             */
            pushed_out: boolean;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** VoidOrderRequest */
        VoidOrderRequest: {
            /** Reason */
            reason: string;
        };
        /** VoidOrderResult */
        VoidOrderResult: {
            /** Left Batches */
            left_batches?: components["schemas"]["VoidedBatch"][];
            /** Lines */
            lines: number;
            /**
             * Order Id
             * Format: uuid
             */
            order_id: string;
            /** Reason */
            reason: string;
            /** Recorded Against Pushed */
            recorded_against_pushed?: components["schemas"]["VoidedBatch"][];
            /**
             * Voided At
             * Format: date-time
             */
            voided_at: string;
        };
        /** WebhookAckResponse */
        WebhookAckResponse: {
            /** Status */
            status: string;
        };
        /**
         * WebhookEvent
         * @enum {string}
         */
        WebhookEvent: "order.created" | "order.status_changed" | "proof.approved" | "product_request.created" | "message.received" | "invoice.sent" | "client.registered";
        /** WebhookSubscription */
        WebhookSubscription: {
            /** Created At */
            created_at: string;
            /** Events */
            events: string[];
            /** Id */
            id: string;
            /** Is Active */
            is_active: boolean;
            /** Organization Id */
            organization_id: string;
            /** Url */
            url: string;
        };
        /** WebhookTestRequest */
        WebhookTestRequest: {
            /** Secret */
            secret: string;
            /** Url */
            url: string;
        };
        /** WebhookTestResponse */
        WebhookTestResponse: {
            /** Success */
            success: boolean;
        };
        /** WhereaboutsHold */
        WhereaboutsHold: {
            /** Cleared At */
            cleared_at?: string | null;
            /** Cleared How */
            cleared_how?: string | null;
            /** Detail */
            detail?: string | null;
            /**
             * Opened At
             * Format: date-time
             */
            opened_at: string;
            /** Reason */
            reason: string;
        };
        /** WhereaboutsLine */
        WhereaboutsLine: {
            /**
             * Art Source
             * @default
             */
            art_source: string;
            /** Cards */
            cards: number;
            /**
             * Line Item Id
             * Format: uuid
             */
            line_item_id: string;
            /** Line No */
            line_no: number;
            /** Pack Size */
            pack_size: number;
            /** Product */
            product: string;
            /** Production Unit Id */
            production_unit_id?: string | null;
            /** Quantity */
            quantity: number;
            /** Scan Code */
            scan_code: string;
            /** Shipment Unit Id */
            shipment_unit_id?: string | null;
        };
        /**
         * WhereaboutsPush
         * @description One ``docket_send_attempted`` audit row of one of the order's units.
         */
        WhereaboutsPush: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /** By */
            by: string;
            /** Docket Number */
            docket_number?: string | null;
            /** Outcome */
            outcome: string;
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /** WhereaboutsUnit */
        WhereaboutsUnit: {
            /**
             * Business Entity
             * @default
             */
            business_entity: string;
            /** Cancelled At */
            cancelled_at?: string | null;
            /** Docket Number */
            docket_number?: string | null;
            /** Formation */
            formation: string;
            /** Holds */
            holds?: components["schemas"]["WhereaboutsHold"][];
            /** Kind */
            kind: string;
            /** Line Item Ids */
            line_item_ids?: string[];
            location?: components["schemas"]["UnitLocation"];
            /** Ordinal */
            ordinal: number;
            /** Pushed At */
            pushed_at?: string | null;
            /** Reference */
            reference: string;
            /** Release State */
            release_state?: string | null;
            /**
             * Scan Code
             * @default
             */
            scan_code: string;
            /** Scans */
            scans?: components["schemas"]["ScanEvent"][];
            /**
             * Unit Id
             * Format: uuid
             */
            unit_id: string;
        };
        /**
         * WideFormatSpec
         * @description Wide-format / grand-format printers — roll-fed, flatbed, and hybrid.
         *
         *     Covers enum ``wide_format``. Common characteristics: multi-channel
         *     inks (CMYK + light channels + white + varnish), high-duty printhead
         *     arrays, flat or roll media, and speed quoted in square-feet-per-hour
         *     (often with draft / quality / production modes).
         *
         *     Resolution notes (e.g. "~600 DPI native (Kyocera grayscale)") live
         *     inside ``Resolution.notes`` — this schema does not surface a separate
         *     ``resolution_notes`` field.
         *
         *     ``positional_accuracy_microns`` also appears on ``CuttingSpec``;
         *     shared because precision flatbed UV printers (DigiTech TruFire) and
         *     digital cutters (Zünd) both publish positional tolerance.
         */
        WideFormatSpec: {
            /** Color Channels */
            color_channels?: string[];
            /** Curing */
            curing?: string | null;
            /** Duplex */
            duplex?: boolean | null;
            /** Ink Type */
            ink_type?: string | null;
            /** Limitations */
            limitations?: string[];
            /** Max Substrate Thickness Common Name */
            max_substrate_thickness_common_name?: string | null;
            /** Max Substrate Thickness Mm */
            max_substrate_thickness_mm?: number | null;
            /** Media Type */
            media_type?: string | null;
            /** Notes */
            notes?: string | null;
            /** Positional Accuracy Microns */
            positional_accuracy_microns?: number | null;
            /** Printheads */
            printheads?: string | null;
            resolution_dpi?: components["schemas"]["Resolution"] | null;
            /** Special Capabilities */
            special_capabilities?: string[];
            /** Speed Notes */
            speed_notes?: string | null;
            /** Speed Sheets Per Hour */
            speed_sheets_per_hour?: number | null;
            speed_sq_ft_per_hour?: components["schemas"]["SpeedSqFtPerHour"] | null;
            /** Supported Materials */
            supported_materials?: string[];
            /** Typical Products */
            typical_products: string[];
        };
        /** WrittenFile */
        WrittenFile: {
            /** Path */
            path: string;
            /** Sha256 */
            sha256: string;
            /** Size Bytes */
            size_bytes: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_platform_summary_admin_agent_feedback_platform_get: {
        parameters: {
            query?: {
                end?: string | null;
                start?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlatformFeedbackSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_platform_analytics_admin_analytics_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlatformAnalytics"];
                };
            };
        };
    };
    list_members_admin_members_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminMember"][];
                };
            };
        };
    };
    list_proposals_admin_proposals_get: {
        parameters: {
            query?: {
                status?: components["schemas"]["ActionProposalStatus"] | null;
                target_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProposal"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    propose_admin_proposals_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeAdminActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_proposal_admin_proposals__proposal_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_admin_proposals__proposal_id__approve_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DecideAdminActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    decline_admin_proposals__proposal_id__decline_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DecideAdminActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_settings_admin_settings_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminSettings"];
                };
            };
        };
    };
    update_settings_admin_settings_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminSettingsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminSettings"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_agent_activity_agent_control_activity_get: {
        parameters: {
            query?: {
                agent_type?: string | null;
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentActivityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_agent_config_agent_control_config_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentConfiguration"];
                };
            };
        };
    };
    update_agent_config_agent_control_config_patch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAgentConfigRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentConfiguration"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    activate_emergency_stop_agent_control_emergency_stop_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmergencyStopResponse"];
                };
            };
        };
    };
    release_emergency_stop_agent_control_emergency_stop_release_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EmergencyStopResponse"];
                };
            };
        };
    };
    get_agent_metrics_agent_control_metrics_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentControlMetrics"];
                };
            };
        };
    };
    run_sandbox_test_agent_control_sandbox_test_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SandboxTestRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SandboxTestResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    submit_feedback_agent_feedback_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitFeedbackRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentFeedbackResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_agent_performance_agent_feedback_agent__agent_id__get: {
        parameters: {
            query?: {
                end?: string | null;
                start?: string | null;
            };
            header?: never;
            path: {
                agent_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentPerformanceDetail"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_feedback_summary_agent_feedback_summary_get: {
        parameters: {
            query?: {
                agent_id?: string | null;
                end?: string | null;
                start?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedbackSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_agent_tasks_agent_tasks_get: {
        parameters: {
            query?: {
                agent_type?: string | null;
                limit?: number;
                offset?: number;
                status_filter?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_agent_task_agent_tasks_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAgentTaskRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_agent_task_agent_tasks__task_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_agent_task_agent_tasks__task_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAgentTaskRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_draft_agent_tasks__task_id__approve_draft_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApproveDraftRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DraftActionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    complete_agent_task_agent_tasks__task_id__complete_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    escalate_agent_task_agent_tasks__task_id__escalate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EscalateAgentTaskRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_task_messages_agent_tasks__task_id__messages_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    send_task_message_agent_tasks__task_id__messages_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendMessageRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reject_draft_agent_tasks__task_id__reject_draft_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DraftActionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    resume_agent_task_agent_tasks__task_id__resume_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    takeover_agent_task_agent_tasks__task_id__takeover_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                task_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TakeoverAgentTaskRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AgentTask"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    export_report_analytics_export_get: {
        parameters: {
            query: {
                end_date?: string | null;
                format: components["schemas"]["teaky_print_portal__models__schemas__analytics__ExportFormat"];
                portal_id?: string | null;
                start_date?: string | null;
                type: components["schemas"]["ExportType"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_fulfillment_analytics_fulfillment_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FulfillmentMetrics"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_orders_analytics_orders_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                granularity?: components["schemas"]["TimeGranularity"];
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrdersOverTimeResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_portal_performance_analytics_portal_performance_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PortalPerformanceResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_client_analytics_analytics_portal__portal_id__get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClientAnalytics"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_revenue_analytics_revenue_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                granularity?: components["schemas"]["TimeGranularity"];
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevenueOverTimeResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_summary_analytics_summary_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SummaryMetrics"];
                };
            };
        };
    };
    get_team_performance_analytics_team_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamPerformanceResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_rep_performance_analytics_team__target_user_id__get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path: {
                target_user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamPerformanceResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_top_products_analytics_top_products_get: {
        parameters: {
            query?: {
                end_date?: string | null;
                limit?: number;
                start_date?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TopProductsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_audit_trail_audit_trail_get: {
        parameters: {
            query?: {
                action?: string | null;
                end_date?: string | null;
                organization_id?: string | null;
                page?: number;
                page_size?: number;
                resource_id?: string | null;
                resource_type?: string | null;
                start_date?: string | null;
                user_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuditTrailPage"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    export_audit_trail_audit_trail_export_get: {
        parameters: {
            query?: {
                action?: string | null;
                end_date?: string | null;
                format?: string;
                organization_id?: string | null;
                resource_id?: string | null;
                resource_type?: string | null;
                start_date?: string | null;
                user_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    change_password_auth_change_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasswordChangedWire"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    clear_lockout_auth_lockouts_clear_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClearLockoutRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClearLockoutResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    login_lockouts_status_auth_lockouts_status_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginRateLimiterHealth"];
                };
            };
        };
    };
    login_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    logout_auth_logout_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    logout_all_auth_logout_all_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    me_auth_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeResponse"];
                };
            };
        };
    };
    list_my_portals_auth_me_portals_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyPortal"][];
                };
            };
        };
    };
    confirm_password_reset_auth_password_reset_confirm_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordResetConfirmBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasswordResetConfirmResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    request_password_reset_auth_password_reset_request_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordResetRequestBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasswordResetRequestResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    refresh_auth_refresh_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RefreshBody"] | null;
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_auth_register_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_sessions_auth_sessions_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionSummary"][];
                };
            };
        };
    };
    signup_availability_auth_signup_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignupAvailability"];
                };
            };
        };
    };
    download_bundle_bridge_bundles__file_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    bundle_written_bridge_bundles__file_id__written_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BundleWrittenReport"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BundleWrittenResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    pending_bundles_bridge_bundles_pending_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PendingBundle"][];
                };
            };
        };
    };
    session_state_bridge_session_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeSessionState"];
                };
            };
        };
    };
    drop_session_bridge_session_delete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeSessionDropped"];
                };
            };
        };
    };
    upload_shadow_history_bridge_shadow_history_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShadowHistoryUpload"];
                };
            };
        };
    };
    download_shadow_history_bridge_shadow_history__upload_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                upload_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    latest_shadow_history_bridge_shadow_history_latest_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShadowHistoryUpload"];
                };
            };
        };
    };
    list_bridge_tokens_bridge_tokens_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeTokenSummary"][];
                };
            };
        };
    };
    issue_bridge_token_bridge_tokens_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BridgeTokenCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeTokenIssued"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    revoke_bridge_token_bridge_tokens__token_id__revoke_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeTokenSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    rotate_bridge_token_bridge_tokens__token_id__rotate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BridgeTokenIssued"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    report_bug_bug_reports_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BugReportCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BugReport"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_business_entities_business_entities_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntity"][];
                };
            };
        };
    };
    create_business_entity_business_entities_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessEntityCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntity"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_business_entity_business_entities__entity_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                entity_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessEntityUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntity"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_business_entity_rules_business_entities_rules_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntityRule"][];
                };
            };
        };
    };
    create_business_entity_rule_business_entities_rules_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessEntityRuleCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntityRule"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    seed_business_entities_business_entities_seed_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntitySeedResult"];
                };
            };
        };
    };
    list_capabilities_capabilities_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capability"][];
                };
            };
        };
    };
    create_company_profile_company_profiles_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCompanyProfileRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyProfile"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_company_profile_company_profiles__profile_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                profile_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyProfile"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_company_profile_company_profiles__profile_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                profile_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCompanyProfileRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyProfile"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_company_profile_by_organization_company_profiles_by_organization__organization_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompanyProfile"] | null;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_activity_crm_activity__user_id__get: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityFeedResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    export_activity_crm_activity__user_id__export_post: {
        parameters: {
            query?: {
                end_date?: string | null;
                start_date?: string | null;
            };
            header?: never;
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExportActivityRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_webhooks_crm_webhooks_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookSubscription"][];
                };
            };
        };
    };
    create_webhook_crm_webhooks_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWebhookRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookSubscription"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_webhook_crm_webhooks__subscription_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                subscription_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    test_webhook_crm_webhooks_test_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookTestRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookTestResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    csp_report_csp_report_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    get_design_session_design__session_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DesignSession"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    export_design_design__session_id__export_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DesignExportRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DesignExportResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    handoff_design_design__session_id__handoff_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DesignHandoffRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DesignHandoffResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    iterate_design_design__session_id__iterate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DesignIterateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DesignGenerateResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_design_design_generate_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DesignGenerateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DesignGenerateResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_product_types_design_product_types_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductTypeInfo"][];
                };
            };
        };
    };
    search_equipment_equipment_get: {
        parameters: {
            query?: {
                equipment_type?: components["schemas"]["EquipmentType"] | null;
                manufacturer?: string | null;
                query?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Equipment"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_custom_equipment_equipment_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEquipmentRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Equipment"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_equipment_equipment__equipment_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                equipment_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Equipment"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_capability_suggestions_equipment_capability_suggestions_get: {
        parameters: {
            query: {
                /** @description Comma-separated equipment UUIDs */
                equipment_ids: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capability"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_escalation_escalations_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEscalationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Escalation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_escalation_escalations__escalation_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                escalation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Escalation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    respond_to_escalation_escalations__escalation_id__respond_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                escalation_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RespondToEscalationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Escalation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_incoming_escalations_escalations_incoming_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Escalation"][];
                };
            };
        };
    };
    list_my_escalations_escalations_mine_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Escalation"][];
                };
            };
        };
    };
    get_routing_options_escalations_routing_options_get: {
        parameters: {
            query?: {
                issue_type?: string | null;
                page_context?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutingOptionsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    convert_file_files__file_id__convert_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConvertFileRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConvertFileResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    run_preflight_files__file_id__preflight_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreflightRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PreflightReportResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_preflight_report_files__file_id__preflight_report_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PreflightReportResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_production_pdf_files__file_id__production_pdf_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductionPdfRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductionPdfResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    healthcheck_healthcheck_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthcheckResponse"];
                };
            };
        };
    };
    get_article_help_articles__article_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                article_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HelpArticle"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    search_help_help_search_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HelpSearchRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HelpSearchResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_suggestions_help_suggestions_get: {
        parameters: {
            query: {
                page: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HelpArticleSummary"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_import_history_import_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportHistoryItem"][];
                };
            };
        };
    };
    get_import_session_import__session_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportSessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    execute_import_import__session_id__execute_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["teaky_print_portal__models__schemas__data_import__ImportResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    map_columns_import__session_id__map_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ColumnMappingRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ValidationResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_import_file_import_upload_post: {
        parameters: {
            query: {
                /** @description product, customer, or order_history */
                import_type: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_import_file_import_upload_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportSessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    pool_intake_inspire_pool_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InspirePoolLineSummary"][];
                };
            };
        };
    };
    poll_now_intake_pagedna_poll_now_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaPollSummary"];
                };
            };
        };
    };
    pool_intake_pagedna_pool_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaPoolLineSummary"][];
                };
            };
        };
    };
    sftp_files_intake_pagedna_sftp_files_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaFileSummary"][];
                };
            };
        };
    };
    sftp_pull_now_intake_pagedna_sftp_pull_now_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaSftpPullSummary"];
                };
            };
        };
    };
    sftp_pulls_intake_pagedna_sftp_pulls_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaSftpPullSummary"][];
                };
            };
        };
    };
    sftp_pull_by_id_intake_pagedna_sftp_pulls__pull_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pull_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaSftpPullSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sftp_rows_intake_pagedna_sftp_rows_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageDnaFileRowSummary"][];
                };
            };
        };
    };
    place_pool_intake_taylor_place_pool_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlacePoolResult"];
                };
            };
        };
    };
    pool_intake_taylor_pool_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PoolLineSummary"][];
                };
            };
        };
    };
    pull_now_intake_taylor_pull_now_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PullSummary"];
                };
            };
        };
    };
    pulls_intake_taylor_pulls_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PullSummary"][];
                };
            };
        };
    };
    pull_by_id_intake_taylor_pulls__pull_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pull_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PullSummary"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    relay_session_intake_taylor_session_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TaylorSessionRelay"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaylorSessionRelayResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    oauth_callback_integrations_quickbooks_callback_get: {
        parameters: {
            query: {
                code: string;
                realmId: string;
                state: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOOAuthCallback"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_sync_config_integrations_quickbooks_config_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOSyncConfigResponse"] | null;
                };
            };
        };
    };
    update_sync_config_integrations_quickbooks_config_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["QBOSyncConfigRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOSyncConfigResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_connect_url_integrations_quickbooks_connect_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOConnectUrlResponse"];
                };
            };
        };
    };
    get_connection_status_integrations_quickbooks_connection_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOConnectionStatus"];
                };
            };
        };
    };
    get_sync_logs_integrations_quickbooks_sync_status_get: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOSyncLogResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_order_sync_status_integrations_quickbooks_sync_status__order_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QBOSyncLogResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_low_stock_items_inventory_low_stock_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LowStockItem"][];
                };
            };
        };
    };
    get_reorder_recommendations_inventory_reorder_recommendations_get: {
        parameters: {
            query?: {
                portal_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReorderRecommendation"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_master_catalog_master_catalog_get: {
        parameters: {
            query?: {
                category?: string | null;
                limit?: number;
                offset?: number;
                product_type?: string | null;
                /** @description Search term */
                query?: string | null;
                subcategory?: string | null;
                supplier?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MasterCatalogProduct"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_master_product_master_catalog__product_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MasterCatalogProduct"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_categories_master_catalog_categories_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
        };
    };
    clone_to_portal_master_catalog_clone_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CloneToPortalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CloneResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    clone_category_master_catalog_clone_category_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CloneCategoryRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CloneResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    seed_catalog_master_catalog_seed_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeedCatalogResponse"];
                };
            };
        };
    };
    list_messages_messages_get: {
        parameters: {
            query?: {
                channel?: string | null;
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_mis_health_mis_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    manual_push_order_mis_orders__order_id__push_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ManualPushResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_order_sync_status_mis_orders__order_id__sync_status_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderSyncStatus"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_products_needing_template_mis_products_needing_template_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductNeedingTemplate"][];
                };
            };
        };
    };
    get_queue_mappings_mis_queue_mappings_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QueueMappingsResponse"];
                };
            };
        };
    };
    update_queue_mappings_mis_queue_mappings_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateQueueMappingsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QueueMappingsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_sync_log_mis_sync_log_get: {
        parameters: {
            query?: {
                /** @description Only entries with this status; needs_template = orders held for a DocketManager template */
                status?: components["schemas"]["MISSyncStatus"] | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MISSyncLogEntry"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_notifications_notifications_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
                unread_only?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Notification"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    mark_all_read_notifications_mark_all_read_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    mark_read_notifications_mark_read_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkReadRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_preferences_notifications_preferences_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesResponse"];
                };
            };
        };
    };
    update_preferences_notifications_preferences_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNotificationPreferencesRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_unread_count_notifications_unread_count_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnreadCountResponse"];
                };
            };
        };
    };
    upload_onboarding_document_onboarding_upload_document_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_onboarding_document_onboarding_upload_document_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentUploadResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_orders_orders_get: {
        parameters: {
            query?: {
                /** @description Drop orders carrying any of these; repeatable; wins over `tag` */
                exclude_tag?: string[];
                /** @description Only live orders without an RGI order number (the desk's view, ruling 2026-10-20) */
                missing_rgi_number?: boolean;
                /** @description Search (dispatch 17–18 Nov 2026, item 2): order number, channel reference (PO), RGI or Docket number, customer, ship-to name, product, or a line's or unit's scan code */
                q?: string;
                status?: string | null;
                /** @description Order tags (ruling 18 Nov 2026): keep orders carrying any of these; repeatable */
                tag?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_order_orders__order_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_order_orders__order_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrderRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    override_order_business_entity_orders__order_id__business_entity_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessEntityOverrideRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntityOverrideResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    cancel_order_orders__order_id__cancel_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelOrderRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_order_costs_orders__order_id__costs_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderCosts"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_order_costs_orders__order_id__costs_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrderCostsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderCosts"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_order_files_orders__order_id__files_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderFile"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_order_file_orders__order_id__files_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_order_file_orders__order_id__files_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderFile"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_order_file_orders__order_id__files__file_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                file_id: string;
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_invoice_orders__order_id__invoice_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceDataResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_invoice_pdf_orders__order_id__invoice_pdf_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_line_item_costs_orders__order_id__line_items__line_item_id__costs_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                line_item_id: string;
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateLineItemCostsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderCosts"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    mark_order_done_orders__order_id__mark_done_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkDoneRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MarkDoneResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_production_status_orders__order_id__production_status_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductionStatusUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductionStatusUpdateResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_proofs_orders__order_id__proofs_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proof"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    submit_proof_orders__order_id__proofs_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitProofRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proof"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    push_alone_orders__order_id__push_alone_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PushAloneRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushAloneResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    release_order_orders__order_id__release_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    link_release_to_docketmanager_order_orders__order_id__release_link_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkDocketManagerOrderRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    confirm_release_not_in_docketmanager_orders__order_id__release_not_found_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_order_status_orders__order_id__status_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrderStatusRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    void_order_orders__order_id__void_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VoidOrderRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VoidOrderResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    order_whereabouts_orders__order_id__whereabouts_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderWhereabouts"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_order_on_behalf_orders_on_behalf_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateOrderOnBehalfRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_shop_tags_orders_tags_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderTagList"];
                };
            };
        };
    };
    list_org_capabilities_organizations__organization_id__capabilities_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capability"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    replace_org_capabilities_organizations__organization_id__capabilities_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OrganizationCapabilitySet"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capability"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_org_equipment_organizations__organization_id__equipment_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationEquipment"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    add_org_equipment_organizations__organization_id__equipment_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddOrganizationEquipmentRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationEquipment"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    remove_org_equipment_organizations__organization_id__equipment__equipment_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                equipment_id: string;
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_my_organization_organizations_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationMe"];
                };
            };
        };
    };
    update_my_organization_organizations_me_patch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrganizationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrganizationMe"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_press_run_config_organizations_me_press_run_config_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PressRunConfig-Output"];
                };
            };
        };
    };
    seed_press_run_config_organizations_me_press_run_config_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PressRunConfigSeedRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PressRunConfigSeedResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_production_settings_organizations_me_production_settings_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductionSettings"];
                };
            };
        };
    };
    update_production_settings_organizations_me_production_settings_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProductionSettingsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductionSettings"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_production_shell_organizations_me_shell_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductionShell"];
                };
            };
        };
    };
    get_tag_rules_organizations_me_tag_rules_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagRules"];
                };
            };
        };
    };
    update_tag_rules_organizations_me_tag_rules_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TagRules"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagRules"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_portal_p__slug__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicPortalResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_cart_p__slug__cart_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Cart"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_or_create_cart_p__slug__cart_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Cart"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    add_cart_item_p__slug__cart_items_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddToCartRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartItem"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    remove_cart_item_p__slug__cart_items__item_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_cart_item_p__slug__cart_items__item_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCartItemRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartItem"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    confirm_checkout_p__slug__checkout_confirm_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmCheckoutRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_payment_intent_p__slug__checkout_create_payment_intent_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePaymentIntentRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatePaymentIntentResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_fundraiser_p__slug__fundraiser_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicFundraiserResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_my_orders_p__slug__orders_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_order_p__slug__orders_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateOrderFromCartRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_my_order_p__slug__orders__order_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    check_safe_order_p__slug__orders_safe_order_check__product_id__get: {
        parameters: {
            query?: {
                color?: string | null;
                size?: string | null;
            };
            header?: never;
            path: {
                product_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SafeOrderCheckResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_products_p__slug__products_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicProduct"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_product_p__slug__products__product_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicProduct"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_product_stock_p__slug__products__product_id__stock_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_id: string;
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductStockResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_portal_user_p__slug__register_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PortalRegisterRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_public_supporters_p__slug__supporters_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicFundraiserSupporter"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_playbooks_playbooks_get: {
        parameters: {
            query?: {
                category?: string | null;
                tier?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybookResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_playbook_playbooks_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePlaybookRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybookResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_playbook_playbooks__playbook_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                playbook_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybookResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_playbook_playbooks__playbook_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                playbook_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePlaybookRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybookResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    apply_playbook_playbooks__playbook_id__apply_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                playbook_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyPlaybookBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApplyPlaybookResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    scale_playbook_playbooks__playbook_id__scale_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                playbook_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScalePlaybookBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScaledPlaybookResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    generate_playbook_playbooks_generate_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GeneratePlaybookRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybookResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_portals_portals_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"][];
                };
            };
        };
    };
    create_portal_portals_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePortalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_portal_portals__portal_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_portal_portals__portal_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePortalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    archive_portal_portals__portal_id__archive_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_brand_assets_portals__portal_id__brand_assets_get: {
        parameters: {
            query?: {
                asset_type?: string | null;
            };
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandAssetResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_brand_asset_portals__portal_id__brand_assets_post: {
        parameters: {
            query?: {
                asset_type?: string;
            };
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_brand_asset_portals__portal_id__brand_assets_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandAssetResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_brand_asset_portals__portal_id__brand_assets__asset_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                asset_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandAssetResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_brand_asset_portals__portal_id__brand_assets__asset_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                asset_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_brand_asset_portals__portal_id__brand_assets__asset_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                asset_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandAssetUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandAssetResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    check_asset_quality_portals__portal_id__brand_assets__asset_id__check_quality_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                asset_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": components["schemas"]["Body_check_asset_quality_portals__portal_id__brand_assets__asset_id__check_quality_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QualityCheckResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_vault_health_portals__portal_id__brand_assets_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VaultHealthResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    migrate_scraped_assets_portals__portal_id__brand_assets_migrate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandAssetResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_categories_portals__portal_id__categories_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_category_portals__portal_id__categories_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCategoryRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_category_portals__portal_id__categories__category_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_category_portals__portal_id__categories__category_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_category_portals__portal_id__categories__category_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category_id: string;
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCategoryRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    set_custom_domain_portals__portal_id__custom_domain_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetCustomDomainRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CustomDomainResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    set_expiration_portals__portal_id__expiration_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetExpirationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_fundraiser_portals__portal_id__fundraiser_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserDetails"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    configure_fundraiser_portals__portal_id__fundraiser_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfigureFundraiserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserDetails"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_fundraiser_portals__portal_id__fundraiser_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFundraiserRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserDetails"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    close_fundraiser_portals__portal_id__fundraiser_close_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserReport"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_fundraiser_report_portals__portal_id__fundraiser_report_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserReport"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_fundraiser_stats_portals__portal_id__fundraiser_stats_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FundraiserStats"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_portal_invitations_portals__portal_id__invitations_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invitation"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    invite_portal_user_portals__portal_id__invitations_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PortalInviteRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invitation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    pause_portal_portals__portal_id__pause_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_products_portals__portal_id__products_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_product_portals__portal_id__products_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProductRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_product_portals__portal_id__products__product_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_product_portals__portal_id__products__product_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_product_portals__portal_id__products__product_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProductRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    confirm_product_price_portals__portal_id__products__product_id__confirm_price_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmPriceRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Product"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_product_inventory_portals__portal_id__products__product_id__inventory_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StockStatus"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    set_product_inventory_portals__portal_id__products__product_id__inventory__variant_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
                variant_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetStockRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StockStatus"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    adjust_product_inventory_portals__portal_id__products__product_id__inventory__variant_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
                variant_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdjustStockRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StockStatus"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_variants_portals__portal_id__products__product_id__variants_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductVariant"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_variant_portals__portal_id__products__product_id__variants_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateVariantRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductVariant"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_variant_portals__portal_id__products__product_id__variants__variant_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
                variant_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductVariant"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_variant_portals__portal_id__products__product_id__variants__variant_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
                variant_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_variant_portals__portal_id__products__product_id__variants__variant_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                product_id: string;
                variant_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateVariantRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductVariant"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_category_margins_portals__portal_id__products_category_margins_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryMargin"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    import_products_portals__portal_id__products_import_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_import_products_portals__portal_id__products_import_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["teaky_print_portal__models__schemas__product__ImportResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reprice_products_portals__portal_id__products_reprice_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RepriceRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RepriceResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    publish_portal_portals__portal_id__publish_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_quotes_portals__portal_id__quotes_get: {
        parameters: {
            query?: {
                page?: number;
                page_size?: number;
                status?: string | null;
            };
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteRequestPage"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_quote_portals__portal_id__quotes_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateQuoteRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteRequest"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_quote_portals__portal_id__quotes__quote_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                quote_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteRequest"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_quote_portals__portal_id__quotes__quote_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
                quote_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateQuoteRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QuoteRequest"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    resume_portal_portals__portal_id__resume_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                portal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    duplicate_portal_portals__template_id__duplicate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                template_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DuplicatePortalRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Portal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    duplicate_portal_batch_portals__template_id__duplicate_batch_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                template_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DuplicatePortalBatchRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DuplicatePortalBatchResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    check_slug_available_portals_check_slug__slug__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: boolean;
                    };
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_from_description_portals_create_from_description_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StoreCreationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StoreCreationResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_lifecycle_summary_portals_lifecycle_summary_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: number;
                    };
                };
            };
        };
    };
    production_export_production_export_get: {
        parameters: {
            query: {
                from: string;
                /** @description orders: one row per order placed in the window; units: one row per unit created in it; lines: D6, one row per order line (the default) */
                grain?: components["schemas"]["ExportGrain"];
                to: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    resolve_barcode_production_floor_resolve_get: {
        parameters: {
            query: {
                barcode: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BarcodeResolution"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    last_scans_production_floor_scans_get: {
        parameters: {
            query?: {
                limit?: number;
                station?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StationScan"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_proposals_production_proposals_get: {
        parameters: {
            query?: {
                status?: components["schemas"]["ActionProposalStatus"] | null;
                target_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionProposal"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    propose_production_proposals_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_proposal_production_proposals__proposal_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_production_proposals__proposal_id__approve_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DecideActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    decline_production_proposals__proposal_id__decline_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proposal_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DecideActionRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActionProposal"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_proof_proofs__proof_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proof_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proof"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    approve_proof_proofs__proof_id__approve_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proof_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ApproveProofRequest"] | null;
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proof"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reject_proof_proofs__proof_id__reject_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                proof_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RejectProofRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proof"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_batches_release_units_get: {
        parameters: {
            query?: {
                /** @description 13 Nov 2026 evening (C): only batches carrying this business entity code */
                business_entity?: string;
                /** @description drop batches whose orders carry any of these; wins over tag */
                exclude_tag?: string[];
                /** @description Ruling 11 Nov 2026: also list per-order production units, labelled by order, after the batches */
                include_per_order?: boolean;
                q?: string;
                /** @description keep batches whose orders carry any of these tags (a26) */
                tag?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BatchSummary"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    read_unit_release_units__unit_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnitRead"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    download_bundle_release_units__unit_id__bundle_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    build_bundle_release_units__unit_id__bundle_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BundleManifest"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    override_unit_business_entity_release_units__unit_id__business_entity_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BusinessEntityOverrideRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BusinessEntityOverrideResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    batch_detail_release_units__unit_id__detail_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BatchDetail"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    half_batch_release_units__unit_id__half_batch_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushOutPreview"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    clear_hold_release_units__unit_id__holds__hold_id__clear_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                hold_id: string;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HoldResolution"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    answer_price_release_units__unit_id__holds__hold_id__price_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                hold_id: string;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PriceAnswer"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    split_once_release_units__unit_id__holds__hold_id__split_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                hold_id: string;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HoldResolution"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    link_unit_release_units__unit_id__link_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkUnitRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    mark_batch_done_release_units__unit_id__mark_done_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkDoneRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MarkDoneResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    unit_not_found_release_units__unit_id__not_found_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    push_out_release_units__unit_id__push_out_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushOutResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    push_out_preview_release_units__unit_id__push_preview_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PushOutPreview"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    release_unit_release_units__unit_id__release_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    station_view_release_units__unit_id__station_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StationView"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    arrived_release_units__unit_id__steps__position__arrived_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                position: number;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScanRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScanResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    done_release_units__unit_id__steps__position__done_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                position: number;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScanRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScanResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    hold_from_station_release_units__unit_id__steps__position__hold_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                position: number;
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["HoldFromStationRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StationHoldResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    job_ticket_release_units__unit_id__ticket_get: {
        parameters: {
            query?: {
                /** @description The office variant, with line totals. */
                priced?: boolean;
                /** @description Render a new ticket; the old one is kept, superseded. */
                regenerate?: boolean;
            };
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    move_lines_release_units_move_lines_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveLinesRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleaseUnit"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    cancel_held_units_release_units_orders__order_id__cancel_held_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                order_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelHeldUnitsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Order"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    held_queue_release_units_queue_get: {
        parameters: {
            query?: {
                /** @description 13 Nov 2026 evening (C): only units carrying this business entity code */
                business_entity?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HeldQueueEntry"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    scrape_website_scrape_website_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScrapeWebsiteRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScrapeWebsiteResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_mis_settings_settings_mis_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MISSettingsResponse"];
                };
            };
        };
    };
    update_mis_settings_settings_mis_patch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMISSettingsRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MISSettingsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    test_mis_connection_settings_mis_test_connection_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestConnectionResponse"];
                };
            };
        };
    };
    purchase_label_shipping_purchase_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PurchaseRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShipmentResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_rates_shipping_rates_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ShippingRateResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_tracking_shipping_tracking__tracking_number__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tracking_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrackingResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_library_spec_library_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecLibraryRow"][];
                };
            };
        };
    };
    correct_stock_spec_library__product_key__assert_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_key: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SpecAssertRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecAssertion"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    product_history_spec_library__product_key__history_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecHistoryEntry"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    mark_not_batched_spec_library__product_key__not_batched_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                product_key: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SpecNotBatchedRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecAssertion"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    product_suggestion_spec_library__product_key__suggest_get: {
        parameters: {
            query?: {
                description?: string;
                portal_id?: string | null;
            };
            header?: never;
            path: {
                product_key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecSuggestion"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    import_spec_rows_spec_library_import_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SpecImportRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SpecImportResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_units_stocked_goods_units_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StockedGoodsUnit"][];
                };
            };
        };
    };
    mark_picked_stocked_goods_units__unit_id__mark_picked_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkPickedRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MarkPickedResult"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    download_shipping_csv_stocked_goods_units__unit_id__shipping_csv_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                unit_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_onboarding_link_stripe_connect_onboarding_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OnboardingResponse"];
                };
            };
        };
    };
    get_stripe_status_stripe_connect_status_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StripeStatusResponse"];
                };
            };
        };
    };
    list_invitations_team_invitations_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invitation"][];
                };
            };
        };
    };
    revoke_invitation_team_invitations__invitation_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                invitation_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    accept_invitation_team_invitations_accept_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvitationTokenBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invitation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    preview_invitation_team_invitations_preview_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvitationTokenBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationPreview"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    register_from_invitation_team_invitations_register_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvitedRegisterRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    invite_member_team_invite_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InviteTeamMemberRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Invitation"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_members_team_members_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamMember"][];
                };
            };
        };
    };
    get_member_team_members__user_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamMember"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    remove_member_team_members__user_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_member_team_members__user_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeamMemberRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamMember"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_file_uploads_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_file_uploads_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    handle_dm_webhook_webhooks_docketmanager__organization_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    stripe_webhook_webhooks_stripe_connect_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookAckResponse"];
                };
            };
        };
    };
    receive_sms_webhooks_twilio_sms__organization_id__post: {
        parameters: {
            query?: never;
            header?: {
                "X-Forwarded-Host"?: string;
                "X-Forwarded-Proto"?: string;
                "X-Twilio-Signature"?: string;
            };
            path: {
                organization_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/x-www-form-urlencoded": components["schemas"]["Body_receive_sms_webhooks_twilio_sms__organization_id__post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}

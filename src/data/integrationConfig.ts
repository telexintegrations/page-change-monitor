export const telexGeneratedConfig = {
  data: {
    data: {
      date: {
        created_at: "2025-02-21",
        updated_at: "2025-02-21",
      },
      descriptions: {
        app_description:
          "Monitors a website for specific changes and alerts via Telex.",
        app_logo: "https://your-logo-url.com/logo.png",
        app_name: "Website Monitor",
        app_url: "https://your-service-url.com",
        background_color: "#ff6600",
      },
      integration_category: "Monitoring & Logging",
      integration_type: "interval",
      is_active: true,
      output: [
        {
          label: "Website Change Detected",
          value: true,
        },
      ],
      key_features: [
        "Monitors website for content changes",
        "Sends alerts via Telex webhook",
        "Supports custom search terms",
      ],
      permissions: {
        monitoring_user: {
          always_online: true,
          display_name: "Website Monitor",
        },
      },
      settings: [
        {
          label: "interval",
          type: "text",
          required: true,
          default: "*/5 * * * *",
        },
        {
          label: "Website URL",
          type: "text",
          required: true,
          default: "https://davidumoru.me/about",
        },
        {
          label: "Search Terms",
          type: "multi-checkbox",
          required: true,
          default: ["people with short attention span"],
          options: [
            "imageYouWantToCheckItsExistence.png",
            "New Blog Post",
            "Updated Title",
          ],
        },
      ],
      tick_url: "https://your-service-url.com/tick",
      target_url: "https://your-service-url.com/webhook",
    },
  },
};

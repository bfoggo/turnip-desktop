#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use prisma_client_rust::queries::QueryError;

#[allow(warnings, unused)]
mod prisma;
use prisma::{campaign, PrismaClient};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            say_hello,
            list_campaigns,
            add_campaign,
            delete_campaign
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn say_hello() -> String {
    "Hello World!".to_string()
}

#[tauri::command]
async fn list_campaigns() -> Result<Vec<String>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let campaigns = client
        .campaign()
        .find_many(vec![])
        .select(campaign::select!({ name }))
        .exec()
        .await?;
    let campaign_names = campaigns
        .into_iter()
        .map(|campaign| campaign.name)
        .collect();
    Ok(campaign_names)
}

#[tauri::command]
async fn add_campaign(campaign_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .campaign()
        .create(campaign_name, vec![])
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn delete_campaign(campaign_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .campaign()
        .delete(campaign::UniqueWhereParam::NameEquals(campaign_name))
        .exec()
        .await?;
    Ok(())
}

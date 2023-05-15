#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use prisma_client_rust::queries::QueryError;

use std::{fmt::Display, vec};

#[allow(warnings, unused)]
mod prisma;
use prisma::{campaign, character, character_type, PrismaClient};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            say_hello,
            list_campaigns,
            add_campaign,
            delete_campaign,
            list_players
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

#[derive(Debug, Clone, Default, serde::Serialize, serde::Deserialize)]
struct CampaignId(i32);

type CharacterData = character::Data;
#[derive(Debug)]
enum CharacterType {
    Player,
    NPC,
}

#[tauri::command]
async fn list_players(campaign_id: CampaignId) -> Result<Vec<CharacterData>, QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    let players = client
        .character()
        .find_many(vec![
            character::WhereParam::CampaignId(prisma::read_filters::IntFilter::Equals(
                campaign_id.0,
            )),
            character::WhereParam::CharacterTypeId(prisma::read_filters::IntFilter::Equals(
                CharacterType::Player as i32,
            )),
        ])
        .exec()
        .await?;
    Ok(players)
}

#[tauri::command]
async fn add_character(campaign_id: CampaignId, character_name: String) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .character()
        .create(
            character_name,
            true,
            true,
            campaign::UniqueWhereParam::IdEquals(campaign_id.0),
            character_type::UniqueWhereParam::IdEquals(CharacterType::Player as i32),
            vec![],
        )
        .exec()
        .await?;
    Ok(())
}

#[tauri::command]
async fn delete_character(character_id: i32) -> Result<(), QueryError> {
    let client = PrismaClient::_builder()
        .build()
        .await
        .expect("Failed to construct Prisma Client.");
    client
        .character()
        .delete(character::UniqueWhereParam::IdEquals(character_id))
        .exec()
        .await?;
    Ok(())
}

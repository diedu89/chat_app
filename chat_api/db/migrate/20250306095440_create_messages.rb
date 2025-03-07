class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.text :content
      t.references :sender, null: false, foreign_key: { to_table: :users }
      t.references :chat_room, null: false, foreign_key: true

      t.timestamps
    end
  end
end

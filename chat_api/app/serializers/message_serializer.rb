class MessageSerializer < ActiveModel::Serializer
  attributes :id, :content, :created_at
  
  belongs_to :sender, serializer: UserSerializer
end
FROM ruby:3.2.0-slim

# Rails app lives here
WORKDIR /rails

# Install system dependencies
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y \
  build-essential \
  curl \
  git \
  libpq-dev \
  postgresql-client \
  zsh \
  pkg-config \
  libjemalloc2 \
  libvips \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

# Set development environment
ENV RAILS_ENV=development \
  BUNDLE_PATH=/usr/local/bundle \
  BUNDLE_APP_CONFIG=/usr/local/bundle

# Create and set up user and directories
RUN groupadd --system --gid 1000 rails && \
  useradd rails --uid 1000 --gid 1000 --create-home --shell /usr/bin/zsh && \
  mkdir -p /rails && \
  mkdir -p "${BUNDLE_PATH}" && \
  chown -R rails:rails /rails && \
  chown -R rails:rails "${BUNDLE_PATH}"

# Copy Gemfile and install gems
COPY --chown=rails:rails Gemfile Gemfile.lock ./
RUN bundle install

RUN chown -R rails:rails "${BUNDLE_PATH}"

# Switch to rails user and install oh-my-zsh
USER rails
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended && \
  echo 'export PATH="$PATH:/rails/bin"' >> /home/rails/.zshrc

# Set default command
CMD ["rails", "server", "-b", "0.0.0.0"]
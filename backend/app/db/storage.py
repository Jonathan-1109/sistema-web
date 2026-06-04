from redis.asyncio import Redis, ConnectionPool

class storage:
    def __init__(self):
        self.pool: ConnectionPool = None
        self.client: Redis = None

    async def connect(self, url):
        self.pool = ConnectionPool.from_url(url)
        self.client = Redis(connection_pool=self.pool)

    async def disconnect(self):
        if self.client:
            await self.client.close()
        if self.pool:
            await self.pool.disconnect()
    
    def get_client(self):
        if not self.client:
            raise RuntimeError("Redis sin conexión")
        return self.client

strg = storage()

def get_redis():
    return strg.get_client()
    
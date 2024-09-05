import {Hono} from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const tableRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
    }
}>();


tableRouter.get('/greeting', async(c)=>{
    return c.json({"msg":"hello workld"});
})

tableRouter.get('/table/:userId', async (c) => {
    const userId =   c.req.param('userId');
    console.log(userId)
  
  
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    console.log(c.env.DATABASE_URL);

    

    const tableConfig = await prisma.tableConfig.findFirst({
        
      where: { userId },
      select:{
        columns:true
      }
    });
  console.log(tableConfig);
   
    if (!tableConfig) {
         return c.json({
         columns: [
          { name: 'Column 1', width: 100 },
          { name: 'Column 2', width: 150 },
        ],
      });
    }
  
    return c.json({ columns: tableConfig.columns });
  });
  


  tableRouter.post('/table/:userId', async (c) => {
  
    const userId = c.req.param('userId');
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }
  
 
    const body = await c.req.json<{ columns: { name: string; width: number }[] }>();
    console.log(body);
  
   
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());
  
    try {
     
      const tableConfig = await prisma.tableConfig.upsert({
        where: { userId },
        update: { columns: body.columns },
        create: { userId, columns: body.columns },
      });
  
      return c.json({ message: 'Table configuration saved successfully.', tableConfig });
    } catch (error) {
      console.error('Error saving table configuration:', error);
      return c.json({ error: 'Failed to save table configuration' }, 500);
    }
  });
  
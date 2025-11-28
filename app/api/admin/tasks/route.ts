/**
 * API Route: /api/admin/tasks
 * GET - Get task execution history
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

const TASK_HISTORY_FILE = path.join(process.cwd(), 'data', 'task-history.json');

/**
 * Task history record interface
 */
interface TaskHistoryRecord {
  id: string;
  timestamp: string;
  durationMinutes: number;
  daysSinceStart: number;
  stage: string;
  targetArticles: number;
  articlesGenerated: number;
  articlesFailed: number;
  topicsInventoryBefore: number;
  topicsInventoryAfter: number;
  topicsReplenished: number;
  success: boolean;
}

/**
 * GET - 获取任务执行历史
 * Query Parameters:
 *   - limit: number (default: 50) - 返回记录数量
 *   - success: boolean (optional) - 筛选成功/失败任务
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 读取历史记录文件
    if (!fs.existsSync(TASK_HISTORY_FILE)) {
      return NextResponse.json({
        tasks: [],
        total: 0,
        message: 'No task history found. Run the automation script to generate history.'
      });
    }

    const content = fs.readFileSync(TASK_HISTORY_FILE, 'utf8');
    let allTasks: TaskHistoryRecord[] = JSON.parse(content);

    // 解析查询参数
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const successParam = searchParams.get('success');

    // 应用 success 筛选
    if (successParam !== null) {
      const filterSuccess = successParam === 'true';
      allTasks = allTasks.filter(task => task.success === filterSuccess);
    }

    // 应用 limit
    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    const tasks = allTasks.slice(0, limit);

    return NextResponse.json({
      tasks,
      total: allTasks.length,
      displayed: tasks.length,
    });
  } catch (error) {
    console.error('Get task history error:', error);
    return NextResponse.json(
      {
        error: 'Failed to read task history',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: /api/admin/tasks/config
 * GET - Get task configuration
 * PUT - Update task configuration
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';

const TASK_CONFIG_FILE = path.join(process.cwd(), 'data', 'task-config.json');
const AUTOMATION_CONFIG_FILE = path.join(process.cwd(), 'automation-config.json');

/**
 * GET - 获取任务配置
 */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 读取 task-config.json
    let taskConfig = null;
    if (fs.existsSync(TASK_CONFIG_FILE)) {
      taskConfig = JSON.parse(fs.readFileSync(TASK_CONFIG_FILE, 'utf8'));
    }

    // 读取 automation-config.json (文章生成配置)
    let automationConfig = null;
    if (fs.existsSync(AUTOMATION_CONFIG_FILE)) {
      automationConfig = JSON.parse(fs.readFileSync(AUTOMATION_CONFIG_FILE, 'utf8'));
    }

    return NextResponse.json({
      taskConfig,
      automationConfig,
    });
  } catch (error) {
    console.error('Get task config error:', error);
    return NextResponse.json(
      {
        error: 'Failed to read task configuration',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT - 更新任务配置
 */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { configType, config } = body;

    if (!configType || !config) {
      return NextResponse.json(
        { error: 'Invalid request. Required: configType and config' },
        { status: 400 }
      );
    }

    if (configType === 'internalLinking') {
      // 更新 task-config.json 中的 internal linking 配置
      let taskConfig = {};
      if (fs.existsSync(TASK_CONFIG_FILE)) {
        taskConfig = JSON.parse(fs.readFileSync(TASK_CONFIG_FILE, 'utf8'));
      }

      // 只更新 internalLinking.config 部分
      (taskConfig as any).internalLinking = {
        ...(taskConfig as any).internalLinking,
        config,
      };

      fs.writeFileSync(TASK_CONFIG_FILE, JSON.stringify(taskConfig, null, 2), 'utf8');

      return NextResponse.json({
        success: true,
        message: 'Internal linking configuration updated',
      });
    } else if (configType === 'articleGeneration') {
      // 更新 automation-config.json
      const currentConfig = JSON.parse(fs.readFileSync(AUTOMATION_CONFIG_FILE, 'utf8'));

      // 合并配置（保留 comments）
      const updatedConfig = {
        ...currentConfig,
        ...config,
        comments: currentConfig.comments, // 保留注释
      };

      fs.writeFileSync(
        AUTOMATION_CONFIG_FILE,
        JSON.stringify(updatedConfig, null, 2),
        'utf8'
      );

      return NextResponse.json({
        success: true,
        message: 'Article generation configuration updated',
      });
    } else {
      return NextResponse.json(
        { error: `Unknown config type: ${configType}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Update task config error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update task configuration',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
